package com.animestudio.app.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AutoAwesome
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Download
import androidx.compose.material.icons.rounded.ErrorOutline
import androidx.compose.material.icons.rounded.Movie
import androidx.compose.material.icons.rounded.MusicNote
import androidx.compose.material.icons.rounded.Pause
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.RecordVoiceOver
import androidx.compose.material.icons.rounded.Replay
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material.icons.rounded.Share
import androidx.compose.material.icons.rounded.VolumeUp
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.media3.ui.PlayerView
import com.animestudio.app.data.AnimeAspectRatio
import com.animestudio.app.data.AnimeAudioMode
import com.animestudio.app.data.AnimePresets
import com.animestudio.app.data.AnimeStyle
import com.animestudio.app.data.VoicePersona
import com.animestudio.app.ui.theme.AmberGold
import com.animestudio.app.ui.theme.ObsidianBg
import com.animestudio.app.ui.theme.SakugaCrimson
import com.animestudio.app.ui.theme.StudioBorder
import com.animestudio.app.ui.theme.StudioSurface
import com.animestudio.app.ui.theme.StudioSurfaceAlt
import com.animestudio.app.ui.theme.TextMuted
import com.animestudio.app.ui.theme.TextPrimary
import kotlin.math.roundToInt

@Composable
fun AnimeStudioScreen(viewModel: AnimeStudioViewModel = viewModel()) {
    val state by viewModel.uiState.collectAsState()
    var showServerDialog by remember { mutableStateOf(false) }

    Scaffold(
        containerColor = ObsidianBg,
        topBar = {
            Surface(
                color = StudioSurface,
                border = BorderStroke(1.dp, StudioBorder)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "AnimeStudio",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    IconButton(onClick = { showServerDialog = true }) {
                        Icon(
                            imageVector = Icons.Rounded.Settings,
                            contentDescription = "Backend Server Settings",
                            tint = TextMuted
                        )
                    }
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Error or Status Banner
            state.errorMessage?.let { error ->
                Surface(
                    color = Color(0xFF2D1218),
                    border = BorderStroke(1.dp, SakugaCrimson.copy(alpha = 0.6f)),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Icon(Icons.Rounded.ErrorOutline, contentDescription = null, tint = SakugaCrimson)
                        Text(
                            text = error,
                            color = TextPrimary,
                            fontSize = 13.sp,
                            modifier = Modifier.weight(1f)
                        )
                        IconButton(onClick = { viewModel.clearBanner() }, modifier = Modifier.size(32.dp)) {
                            Icon(Icons.Rounded.Close, contentDescription = "Dismiss", tint = TextMuted)
                        }
                    }
                }
            }

            state.statusMessage?.let { status ->
                if (state.errorMessage == null && !state.isGenerating) {
                    Surface(
                        color = StudioSurface,
                        border = BorderStroke(1.dp, StudioBorder),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                Icons.Rounded.CheckCircle,
                                contentDescription = null,
                                tint = AmberGold,
                                modifier = Modifier.size(18.dp)
                            )
                            Text(
                                text = status,
                                color = TextPrimary,
                                fontSize = 13.sp,
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }
            }

            // Video Stage & Synchronized Audio Player
            Surface(
                color = StudioSurface,
                border = BorderStroke(1.dp, StudioBorder),
                shape = RoundedCornerShape(20.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    val ratioFloat = if (state.currentClip?.aspectRatio == "9:16" ||
                        (state.currentClip == null && state.aspectRatio == AnimeAspectRatio.PORTRAIT_9_16)
                    ) 9f / 16f else 16f / 9f

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .aspectRatio(ratioFloat.coerceAtLeast(0.75f))
                            .clip(RoundedCornerShape(14.dp))
                            .background(Color.Black),
                        contentAlignment = Alignment.Center
                    ) {
                        if (state.currentClip != null) {
                            AndroidView(
                                factory = { ctx ->
                                    PlayerView(ctx).apply {
                                        player = viewModel.mediaController.exoPlayer
                                        useController = false
                                    }
                                },
                                modifier = Modifier.fillMaxSize()
                            )

                            val dialogue = state.currentClip?.dialogueLine.orEmpty()
                            if (dialogue.isNotBlank()) {
                                Box(
                                    modifier = Modifier
                                        .align(Alignment.BottomCenter)
                                        .fillMaxWidth()
                                        .background(Color.Black.copy(alpha = 0.65f))
                                        .padding(horizontal = 12.dp, vertical = 8.dp)
                                ) {
                                    Text(
                                        text = "${state.currentClip?.speakerName}: \"$dialogue\"",
                                        color = Color.White,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Medium,
                                        maxLines = 2,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }
                            }
                        } else if (state.isGenerating) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(12.dp),
                                modifier = Modifier.padding(24.dp)
                            ) {
                                CircularProgressIndicator(color = SakugaCrimson)
                                Text(
                                    text = "Rendering anime video & audio tracks...",
                                    color = TextPrimary,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "This takes 30–120 seconds on the Gemini video server.",
                                    color = TextMuted,
                                    fontSize = 12.sp
                                )
                            }
                        } else {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(8.dp),
                                modifier = Modifier.padding(24.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Movie,
                                    contentDescription = null,
                                    tint = TextMuted,
                                    modifier = Modifier.size(40.dp)
                                )
                                Text(
                                    text = "Describe an anime scene below",
                                    color = TextPrimary,
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 15.sp
                                )
                                Text(
                                    text = "Generates MP4 anime video with AI voiceover and soundtrack",
                                    color = TextMuted,
                                    fontSize = 12.sp
                                )
                            }
                        }
                    }

                    // Playback & Export Controls
                    state.currentClip?.let { clip ->
                        Text(
                            text = "${clip.title} · ${clip.durationSeconds}s · ${clip.aspectRatio}",
                            color = TextMuted,
                            fontSize = 12.sp
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Button(
                                onClick = { viewModel.togglePlayPause() },
                                colors = ButtonDefaults.buttonColors(containerColor = SakugaCrimson),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(
                                    imageVector = if (state.isPlaying) Icons.Rounded.Pause else Icons.Rounded.PlayArrow,
                                    contentDescription = null
                                )
                                Spacer(Modifier.width(6.dp))
                                Text(if (state.isPlaying) "Pause" else "Play")
                            }

                            OutlinedButton(
                                onClick = { viewModel.restartPlayback() },
                                border = BorderStroke(1.dp, StudioBorder),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Rounded.Replay, contentDescription = "Restart", tint = TextPrimary)
                            }

                            OutlinedButton(
                                onClick = { viewModel.saveCurrentClipToGallery() },
                                border = BorderStroke(1.dp, StudioBorder),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Rounded.Download, contentDescription = "Save MP4", tint = AmberGold)
                            }

                            OutlinedButton(
                                onClick = { viewModel.shareCurrentClip() },
                                border = BorderStroke(1.dp, StudioBorder),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Rounded.Share, contentDescription = "Share MP4", tint = TextPrimary)
                            }
                        }

                        HorizontalDivider(color = StudioBorder)

                        // Audio Track Mixer
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(
                                text = "Audio Track Mixer",
                                color = TextPrimary,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                            AudioSliderRow(
                                icon = Icons.Rounded.VolumeUp,
                                label = "Video Audio",
                                value = state.videoVolume,
                                onChange = { v -> viewModel.updateVolumes(v, state.voiceVolume, state.musicVolume) }
                            )
                            if (clip.voiceAudioFile != null) {
                                AudioSliderRow(
                                    icon = Icons.Rounded.RecordVoiceOver,
                                    label = "Voiceover",
                                    value = state.voiceVolume,
                                    onChange = { v -> viewModel.updateVolumes(state.videoVolume, v, state.musicVolume) }
                                )
                            }
                            if (clip.musicAudioFile != null) {
                                AudioSliderRow(
                                    icon = Icons.Rounded.MusicNote,
                                    label = "Soundtrack",
                                    value = state.musicVolume,
                                    onChange = { v -> viewModel.updateVolumes(state.videoVolume, state.voiceVolume, v) }
                                )
                            }
                        }
                    }
                }
            }

            // Scene Prompt & Presets Card
            Surface(
                color = StudioSurface,
                border = BorderStroke(1.dp, StudioBorder),
                shape = RoundedCornerShape(20.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    Text(
                        text = "Scene Prompt",
                        color = TextPrimary,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 15.sp
                    )

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        AnimePresets.samples.forEach { preset ->
                            Surface(
                                color = StudioSurfaceAlt,
                                border = BorderStroke(1.dp, StudioBorder),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.clickable { viewModel.applyPreset(preset) }
                            ) {
                                Text(
                                    text = preset.title,
                                    color = TextPrimary,
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                                )
                            }
                        }
                    }

                    OutlinedTextField(
                        value = state.prompt,
                        onValueChange = { viewModel.updatePrompt(it) },
                        placeholder = {
                            Text(
                                "e.g. A cyber samurai charges through neon rain as lightning strikes behind him...",
                                color = TextMuted,
                                fontSize = 13.sp
                            )
                        },
                        minLines = 3,
                        maxLines = 5,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp)
                    )

                    // Anime Style Picker
                    Text("Visual Style", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        AnimeStyle.entries.chunked(2).forEach { pair ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                pair.forEach { style ->
                                    val selected = state.selectedStyle == style
                                    Surface(
                                        color = if (selected) SakugaCrimson.copy(alpha = 0.14f) else StudioSurfaceAlt,
                                        border = BorderStroke(1.dp, if (selected) SakugaCrimson else StudioBorder),
                                        shape = RoundedCornerShape(12.dp),
                                        modifier = Modifier
                                            .weight(1f)
                                            .clickable { viewModel.selectStyle(style) }
                                    ) {
                                        Column(modifier = Modifier.padding(10.dp)) {
                                            Text(
                                                text = style.label,
                                                color = TextPrimary,
                                                fontWeight = FontWeight.SemiBold,
                                                fontSize = 13.sp
                                            )
                                            Text(
                                                text = style.subtitle,
                                                color = TextMuted,
                                                fontSize = 11.sp,
                                                maxLines = 1,
                                                overflow = TextOverflow.Ellipsis
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Aspect Ratio & Duration
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        AnimeAspectRatio.entries.forEach { ratio ->
                            val selected = state.aspectRatio == ratio
                            Surface(
                                color = if (selected) AmberGold.copy(alpha = 0.14f) else StudioSurfaceAlt,
                                border = BorderStroke(1.dp, if (selected) AmberGold else StudioBorder),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { viewModel.selectAspectRatio(ratio) }
                            ) {
                                Text(
                                    text = ratio.label,
                                    color = TextPrimary,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium,
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp)
                                )
                            }
                        }
                    }

                    Column {
                        Text(
                            text = "Clip Duration: ${state.durationSeconds} seconds",
                            color = TextMuted,
                            fontSize = 12.sp
                        )
                        Slider(
                            value = state.durationSeconds.toFloat(),
                            onValueChange = { viewModel.updateDuration(it.roundToInt()) },
                            valueRange = 3f..15f,
                            steps = 11,
                            colors = SliderDefaults.colors(
                                thumbColor = SakugaCrimson,
                                activeTrackColor = SakugaCrimson
                            )
                        )
                    }

                    // Audio Output Mode & Voice Persona
                    Text("Audio Output Mode", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        AnimeAudioMode.entries.forEach { mode ->
                            val selected = state.audioMode == mode
                            Surface(
                                color = if (selected) SakugaCrimson.copy(alpha = 0.14f) else StudioSurfaceAlt,
                                border = BorderStroke(1.dp, if (selected) SakugaCrimson else StudioBorder),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { viewModel.selectAudioMode(mode) }
                            ) {
                                Text(
                                    text = mode.label,
                                    color = TextPrimary,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Medium,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 10.dp),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    }

                    if (state.audioMode != AnimeAudioMode.MUSIC_ONLY) {
                        Text("Voice Persona", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .horizontalScroll(rememberScrollState()),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            VoicePersona.entries.forEach { persona ->
                                val selected = state.voicePersona == persona
                                Surface(
                                    color = if (selected) AmberGold.copy(alpha = 0.14f) else StudioSurfaceAlt,
                                    border = BorderStroke(1.dp, if (selected) AmberGold else StudioBorder),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier.clickable { viewModel.selectVoicePersona(persona) }
                                ) {
                                    Text(
                                        text = persona.label,
                                        color = TextPrimary,
                                        fontSize = 12.sp,
                                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                                    )
                                }
                            }
                        }
                    }

                    Button(
                        onClick = { viewModel.generateAnimeVideo() },
                        enabled = state.prompt.isNotBlank() && !state.isGenerating,
                        colors = ButtonDefaults.buttonColors(containerColor = SakugaCrimson),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                    ) {
                        Icon(Icons.Rounded.AutoAwesome, contentDescription = null)
                        Spacer(Modifier.width(8.dp))
                        Text(
                            text = if (state.isGenerating) "Generating Anime Video..." else "Generate Anime Video + Audio",
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }

    if (showServerDialog) {
        var draftUrl by remember(state.backendUrl) { mutableStateOf(state.backendUrl) }
        AlertDialog(
            onDismissRequest = { showServerDialog = false },
            containerColor = StudioSurface,
            title = { Text("Studio Backend URL", color = TextPrimary) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        "Enter the base URL of your running server hosting /api/anime/generate.",
                        color = TextMuted,
                        fontSize = 13.sp
                    )
                    OutlinedTextField(
                        value = draftUrl,
                        onValueChange = { draftUrl = it },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    TextButton(onClick = {
                        viewModel.saveBackendUrl(draftUrl)
                        viewModel.testServerConnection()
                    }) {
                        Text("Save & Test Connection", color = AmberGold)
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.saveBackendUrl(draftUrl)
                        showServerDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = SakugaCrimson)
                ) {
                    Text("Done")
                }
            },
            dismissButton = {
                TextButton(onClick = { showServerDialog = false }) {
                    Text("Cancel", color = TextMuted)
                }
            }
        )
    }
}

@Composable
private fun AudioSliderRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: Float,
    onChange: (Float) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Icon(icon, contentDescription = null, tint = TextMuted, modifier = Modifier.size(18.dp))
        Text(label, color = TextMuted, fontSize = 12.sp, modifier = Modifier.width(78.dp))
        Slider(
            value = value,
            onValueChange = onChange,
            valueRange = 0f..1f,
            modifier = Modifier.weight(1f),
            colors = SliderDefaults.colors(
                thumbColor = AmberGold,
                activeTrackColor = AmberGold
            )
        )
    }
}
