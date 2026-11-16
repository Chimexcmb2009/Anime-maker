package com.animestudio.app.media

import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import androidx.core.content.FileProvider
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import com.animestudio.app.BuildConfig
import com.animestudio.app.data.GeneratedAnimeClip
import java.io.File

class SyncedMediaController(private val context: Context) {

    val exoPlayer: ExoPlayer = ExoPlayer.Builder(context).build().apply {
        repeatMode = Player.REPEAT_MODE_OFF
    }

    private var voicePlayer: MediaPlayer? = null
    private var musicPlayer: MediaPlayer? = null

    private var videoVolume = 0.85f
    private var voiceVolume = 1.0f
    private var musicVolume = 0.45f

    fun loadClip(
        clip: GeneratedAnimeClip,
        onPlaybackStateChanged: (Boolean) -> Unit
    ) {
        releaseAudioTracks()

        exoPlayer.stop()
        exoPlayer.clearMediaItems()
        exoPlayer.setMediaItem(MediaItem.fromUri(Uri.fromFile(clip.videoFile)))
        exoPlayer.volume = videoVolume
        exoPlayer.prepare()

        exoPlayer.addListener(object : Player.Listener {
            override fun onIsPlayingChanged(isPlaying: Boolean) {
                onPlaybackStateChanged(isPlaying)
                if (!isPlaying && exoPlayer.playbackState == Player.STATE_ENDED) {
                    pauseAudioTracks()
                }
            }
        })

        clip.voiceAudioFile?.let { file ->
            voicePlayer = MediaPlayer().apply {
                setDataSource(file.absolutePath)
                setVolume(voiceVolume, voiceVolume)
                prepare()
            }
        }

        clip.musicAudioFile?.let { file ->
            musicPlayer = MediaPlayer().apply {
                setDataSource(file.absolutePath)
                setVolume(musicVolume, musicVolume)
                isLooping = true
                prepare()
            }
        }
    }

    fun play() {
        if (exoPlayer.playbackState == Player.STATE_ENDED) {
            restart()
            return
        }
        exoPlayer.play()
        voicePlayer?.let { vp ->
            if (!vp.isPlaying && exoPlayer.currentPosition < vp.duration) {
                vp.seekTo(exoPlayer.currentPosition.toInt().coerceAtMost(vp.duration))
                vp.start()
            }
        }
        musicPlayer?.let { mp ->
            if (!mp.isPlaying) {
                mp.start()
            }
        }
    }

    fun pause() {
        exoPlayer.pause()
        pauseAudioTracks()
    }

    fun restart() {
        exoPlayer.seekTo(0)
        voicePlayer?.seekTo(0)
        musicPlayer?.seekTo(0)
        exoPlayer.play()
        voicePlayer?.start()
        musicPlayer?.start()
    }

    private fun pauseAudioTracks() {
        voicePlayer?.takeIf { it.isPlaying }?.pause()
        musicPlayer?.takeIf { it.isPlaying }?.pause()
    }

    fun updateVolumes(video: Float, voice: Float, music: Float) {
        videoVolume = video
        voiceVolume = voice
        musicVolume = music
        exoPlayer.volume = video
        voicePlayer?.setVolume(voice, voice)
        musicPlayer?.setVolume(music, music)
    }

    fun saveVideoToGallery(clip: GeneratedAnimeClip): Result<String> {
        return try {
            val fileName = "${clip.title.replace(Regex("[^A-Za-z0-9_-]"), "_")}_${System.currentTimeMillis()}.mp4"
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val values = ContentValues().apply {
                    put(MediaStore.Video.Media.DISPLAY_NAME, fileName)
                    put(MediaStore.Video.Media.MIME_TYPE, "video/mp4")
                    put(
                        MediaStore.Video.Media.RELATIVE_PATH,
                        "${Environment.DIRECTORY_MOVIES}/AnimeStudio"
                    )
                    put(MediaStore.Video.Media.IS_PENDING, 1)
                }
                val resolver = context.contentResolver
                val uri = resolver.insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, values)
                    ?: return Result.failure(IllegalStateException("Unable to create MediaStore entry"))

                resolver.openOutputStream(uri)?.use { out ->
                    clip.videoFile.inputStream().use { input -> input.copyTo(out) }
                }
                values.clear()
                values.put(MediaStore.Video.Media.IS_PENDING, 0)
                resolver.update(uri, values, null, null)
                Result.success("Saved to Movies/AnimeStudio/$fileName")
            } else {
                @Suppress("DEPRECATION")
                val moviesDir = File(
                    Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MOVIES),
                    "AnimeStudio"
                ).apply { mkdirs() }
                val dest = File(moviesDir, fileName)
                clip.videoFile.copyTo(dest, overwrite = true)
                Result.success("Saved to ${dest.absolutePath}")
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun shareVideo(clip: GeneratedAnimeClip) {
        val uri = FileProvider.getUriForFile(
            context,
            "${BuildConfig.APPLICATION_ID}.fileprovider",
            clip.videoFile
        )
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "video/mp4"
            putExtra(Intent.EXTRA_STREAM, uri)
            putExtra(Intent.EXTRA_SUBJECT, clip.title)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(Intent.createChooser(intent, "Share Anime Video").apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        })
    }

    private fun releaseAudioTracks() {
        voicePlayer?.release()
        voicePlayer = null
        musicPlayer?.release()
        musicPlayer = null
    }

    fun release() {
        releaseAudioTracks()
        exoPlayer.release()
    }
}
