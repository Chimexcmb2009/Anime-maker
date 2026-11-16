package com.animestudio.app.ui

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.animestudio.app.BuildConfig
import com.animestudio.app.data.AnimeAspectRatio
import com.animestudio.app.data.AnimeAudioMode
import com.animestudio.app.data.AnimePreset
import com.animestudio.app.data.AnimeStyle
import com.animestudio.app.data.GeneratedAnimeClip
import com.animestudio.app.data.VoicePersona
import com.animestudio.app.media.SyncedMediaController
import com.animestudio.app.network.AnimeApiClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class AnimeStudioUiState(
    val backendUrl: String = BuildConfig.DEFAULT_BACKEND_URL,
    val prompt: String = "",
    val selectedStyle: AnimeStyle = AnimeStyle.MODERN_SHONEN,
    val aspectRatio: AnimeAspectRatio = AnimeAspectRatio.LANDSCAPE_16_9,
    val durationSeconds: Int = 8,
    val audioMode: AnimeAudioMode = AnimeAudioMode.FULL,
    val voicePersona: VoicePersona = VoicePersona.DRAMATIC_HERO,
    val isGenerating: Boolean = false,
    val isPlaying: Boolean = false,
    val videoVolume: Float = 0.85f,
    val voiceVolume: Float = 1.0f,
    val musicVolume: Float = 0.45f,
    val currentClip: GeneratedAnimeClip? = null,
    val errorMessage: String? = null,
    val statusMessage: String? = null
)

class AnimeStudioViewModel(application: Application) : AndroidViewModel(application) {

    private val prefs = application.getSharedPreferences("anime_studio_prefs", Context.MODE_PRIVATE)
    private val apiClient = AnimeApiClient(application)
    val mediaController = SyncedMediaController(application)

    private val _uiState = MutableStateFlow(
        AnimeStudioUiState(
            backendUrl = prefs.getString("backend_url", BuildConfig.DEFAULT_BACKEND_URL)
                ?: BuildConfig.DEFAULT_BACKEND_URL
        )
    )
    val uiState: StateFlow<AnimeStudioUiState> = _uiState.asStateFlow()

    fun updatePrompt(value: String) {
        _uiState.update { it.copy(prompt = value, errorMessage = null) }
    }

    fun selectStyle(style: AnimeStyle) {
        _uiState.update { it.copy(selectedStyle = style) }
    }

    fun selectAspectRatio(ratio: AnimeAspectRatio) {
        _uiState.update { it.copy(aspectRatio = ratio) }
    }

    fun updateDuration(seconds: Int) {
        _uiState.update { it.copy(durationSeconds = seconds.coerceIn(3, 15)) }
    }

    fun selectAudioMode(mode: AnimeAudioMode) {
        _uiState.update { it.copy(audioMode = mode) }
    }

    fun selectVoicePersona(persona: VoicePersona) {
        _uiState.update { it.copy(voicePersona = persona) }
    }

    fun applyPreset(preset: AnimePreset) {
        _uiState.update {
            it.copy(
                prompt = preset.prompt,
                selectedStyle = preset.style,
                aspectRatio = preset.aspectRatio,
                errorMessage = null
            )
        }
    }

    fun saveBackendUrl(url: String) {
        val cleaned = url.trim().trimEnd('/')
        if (cleaned.isNotBlank()) {
            prefs.edit().putString("backend_url", cleaned).apply()
            _uiState.update { it.copy(backendUrl = cleaned, statusMessage = "Server URL updated") }
        }
    }

    fun testServerConnection() {
        val url = _uiState.value.backendUrl
        viewModelScope.launch {
            _uiState.update { it.copy(statusMessage = "Checking backend...", errorMessage = null) }
            val result = apiClient.checkHealth(url)
            result.fold(
                onSuccess = { hasKey ->
                    val msg = if (hasKey) {
                        "Connected. Gemini video & audio models ready."
                    } else {
                        "Connected, but server GEMINI_API_KEY is not set."
                    }
                    _uiState.update { it.copy(statusMessage = msg) }
                },
                onFailure = { err ->
                    _uiState.update {
                        it.copy(
                            statusMessage = null,
                            errorMessage = "Could not reach server: ${err.message}"
                        )
                    }
                }
            )
        }
    }

    fun generateAnimeVideo() {
        val state = _uiState.value
        if (state.prompt.isBlank() || state.isGenerating) return

        viewModelScope.launch {
            mediaController.pause()
            _uiState.update {
                it.copy(
                    isGenerating = true,
                    errorMessage = null,
                    statusMessage = "Directing anime scene, video frames, voiceover, and soundtrack..."
                )
            }

            val result = apiClient.generateAnimeClip(
                baseUrl = state.backendUrl,
                prompt = state.prompt,
                animeStyle = state.selectedStyle.id,
                aspectRatio = state.aspectRatio.id,
                durationSeconds = state.durationSeconds,
                audioMode = state.audioMode.id,
                voicePersona = state.voicePersona.id
            )

            result.fold(
                onSuccess = { clip ->
                    mediaController.loadClip(clip) { playing ->
                        _uiState.update { it.copy(isPlaying = playing) }
                    }
                    mediaController.play()
                    _uiState.update {
                        it.copy(
                            isGenerating = false,
                            currentClip = clip,
                            statusMessage = "Generated \"${clip.title}\" (${clip.durationSeconds}s)"
                        )
                    }
                },
                onFailure = { err ->
                    _uiState.update {
                        it.copy(
                            isGenerating = false,
                            statusMessage = null,
                            errorMessage = err.message ?: "Anime video generation failed."
                        )
                    }
                }
            )
        }
    }

    fun togglePlayPause() {
        if (_uiState.value.isPlaying) {
            mediaController.pause()
        } else {
            mediaController.play()
        }
    }

    fun restartPlayback() {
        mediaController.restart()
    }

    fun updateVolumes(video: Float, voice: Float, music: Float) {
        mediaController.updateVolumes(video, voice, music)
        _uiState.update {
            it.copy(
                videoVolume = video,
                voiceVolume = voice,
                musicVolume = music
            )
        }
    }

    fun saveCurrentClipToGallery() {
        val clip = _uiState.value.currentClip ?: return
        val result = mediaController.saveVideoToGallery(clip)
        result.fold(
            onSuccess = { msg ->
                _uiState.update { it.copy(statusMessage = msg, errorMessage = null) }
            },
            onFailure = { err ->
                _uiState.update { it.copy(errorMessage = "Save failed: ${err.message}") }
            }
        )
    }

    fun shareCurrentClip() {
        val clip = _uiState.value.currentClip ?: return
        mediaController.shareVideo(clip)
    }

    fun clearBanner() {
        _uiState.update { it.copy(errorMessage = null, statusMessage = null) }
    }

    override fun onCleared() {
        super.onCleared()
        mediaController.release()
    }
}
