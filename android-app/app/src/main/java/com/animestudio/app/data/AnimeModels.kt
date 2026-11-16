package com.animestudio.app.data

import java.io.File

enum class AnimeStyle(val id: String, val label: String, val subtitle: String) {
    MODERN_SHONEN("modern_shonen", "Modern Shonen", "Sakuga action, crisp cel-shading"),
    GHIBLI_PAINTERLY("ghibli_painterly", "Painterly Cinema", "Lush watercolor, golden hour"),
    RETRO_90S_OVA("retro_90s_ova", "90s Cel OVA", "Classic film grain & sharp ink"),
    CYBERPUNK_MECHA("cyberpunk_mecha", "Cyberpunk Mecha", "Neon rain & anamorphic lens")
}

enum class AnimeAspectRatio(val id: String, val label: String) {
    LANDSCAPE_16_9("16:9", "16:9 Widescreen"),
    PORTRAIT_9_16("9:16", "9:16 Vertical")
}

enum class AnimeAudioMode(val id: String, val label: String) {
    FULL("full", "Voice + BGM + SFX"),
    VOICE_ONLY("voice_only", "Voiceover Only"),
    MUSIC_ONLY("music_only", "Soundtrack Only")
}

enum class VoicePersona(val id: String, val label: String) {
    DRAMATIC_HERO("dramatic_hero", "Heroic Lead"),
    CALM_MENTOR("calm_mentor", "Wise Sensei"),
    ENERGETIC_RIVAL("energetic_rival", "Fiery Rival"),
    NARRATOR_FEMALE("narrator_female", "Story Narrator")
}

data class AnimePreset(
    val title: String,
    val prompt: String,
    val style: AnimeStyle,
    val aspectRatio: AnimeAspectRatio
)

data class GeneratedAnimeClip(
    val id: String,
    val title: String,
    val directorPrompt: String,
    val speakerName: String,
    val dialogueLine: String,
    val durationSeconds: Int,
    val aspectRatio: String,
    val animeStyle: String,
    val videoFile: File,
    val voiceAudioFile: File?,
    val musicAudioFile: File?
)

object AnimePresets {
    val samples = listOf(
        AnimePreset(
            title = "Sakura Blade Duel",
            prompt = "A lone samurai stands beneath falling cherry blossoms at dusk as lightning crackles around his katana before a sudden dash.",
            style = AnimeStyle.MODERN_SHONEN,
            aspectRatio = AnimeAspectRatio.LANDSCAPE_16_9
        ),
        AnimePreset(
            title = "Sky Train Over Sea",
            prompt = "A young girl looks out the window of a vintage train gliding over glowing ocean water under towering golden cumulus clouds.",
            style = AnimeStyle.GHIBLI_PAINTERLY,
            aspectRatio = AnimeAspectRatio.LANDSCAPE_16_9
        ),
        AnimePreset(
            title = "Neo-Tokyo Rain Chase",
            prompt = "A cybernetic courier leaps across rain-soaked holographic rooftops while drones sweep searchlights through neon mist.",
            style = AnimeStyle.CYBERPUNK_MECHA,
            aspectRatio = AnimeAspectRatio.PORTRAIT_9_16
        )
    )
}
