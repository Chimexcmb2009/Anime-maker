package com.animestudio.app.network

import android.content.Context
import android.util.Base64
import com.animestudio.app.data.GeneratedAnimeClip
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.File
import java.util.concurrent.TimeUnit

class AnimeApiClient(private val context: Context) {

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .readTimeout(330, TimeUnit.SECONDS)
        .build()

    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    suspend fun checkHealth(baseUrl: String): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val cleanBase = baseUrl.trim().trimEnd('/')
            val request = Request.Builder()
                .url("$cleanBase/api/anime/health")
                .get()
                .build()

            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    return@withContext Result.failure(
                        IllegalStateException("Server returned HTTP ${response.code}")
                    )
                }
                val body = response.body?.string().orEmpty()
                val json = JSONObject(body)
                val hasKey = json.optBoolean("hasApiKey", false)
                Result.success(hasKey)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun generateAnimeClip(
        baseUrl: String,
        prompt: String,
        animeStyle: String,
        aspectRatio: String,
        durationSeconds: Int,
        audioMode: String,
        voicePersona: String
    ): Result<GeneratedAnimeClip> = withContext(Dispatchers.IO) {
        try {
            val cleanBase = baseUrl.trim().trimEnd('/')
            val payload = JSONObject().apply {
                put("prompt", prompt)
                put("animeStyle", animeStyle)
                put("aspectRatio", aspectRatio)
                put("durationSeconds", durationSeconds)
                put("audioMode", audioMode)
                put("voicePersona", voicePersona)
            }

            val request = Request.Builder()
                .url("$cleanBase/api/anime/generate")
                .post(payload.toString().toRequestBody(jsonMediaType))
                .build()

            client.newCall(request).execute().use { response ->
                val rawBody = response.body?.string().orEmpty()
                if (!response.isSuccessful) {
                    val errMsg = runCatching {
                        JSONObject(rawBody).optString("error")
                    }.getOrNull().takeIf { !it.isNullOrBlank() }
                        ?: "Generation failed (HTTP ${response.code})"
                    return@withContext Result.failure(IllegalStateException(errMsg))
                }

                val json = JSONObject(rawBody)
                val videoB64 = json.optString("videoBase64", "")
                if (videoB64.isBlank()) {
                    return@withContext Result.failure(
                        IllegalStateException("Backend returned empty video payload.")
                    )
                }

                val clipId = "anime_${System.currentTimeMillis()}"
                val outputDir = File(context.cacheDir, "anime_clips").apply { mkdirs() }

                val videoFile = File(outputDir, "$clipId.mp4").apply {
                    writeBytes(Base64.decode(videoB64, Base64.DEFAULT))
                }

                val voiceB64 = json.optString("voiceAudioBase64", "")
                val voiceFile = if (voiceB64.isNotBlank() && voiceB64 != "null") {
                    File(outputDir, "${clipId}_voice.wav").apply {
                        writeBytes(Base64.decode(voiceB64, Base64.DEFAULT))
                    }
                } else {
                    null
                }

                val musicB64 = json.optString("musicAudioBase64", "")
                val musicFile = if (musicB64.isNotBlank() && musicB64 != "null") {
                    File(outputDir, "${clipId}_music.wav").apply {
                        writeBytes(Base64.decode(musicB64, Base64.DEFAULT))
                    }
                } else {
                    null
                }

                Result.success(
                    GeneratedAnimeClip(
                        id = clipId,
                        title = json.optString("title", "Anime Scene"),
                        directorPrompt = json.optString("directorPrompt", prompt),
                        speakerName = json.optString("speakerName", "Protagonist"),
                        dialogueLine = json.optString("dialogueLine", ""),
                        durationSeconds = json.optInt("durationSeconds", durationSeconds),
                        aspectRatio = json.optString("aspectRatio", aspectRatio),
                        animeStyle = json.optString("animeStyle", animeStyle),
                        videoFile = videoFile,
                        voiceAudioFile = voiceFile,
                        musicAudioFile = musicFile
                    )
                )
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
