package com.animestudio.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val ObsidianBg = Color(0xFF0B0D14)
val StudioSurface = Color(0xFF141824)
val StudioSurfaceAlt = Color(0xFF1C2233)
val StudioBorder = Color(0xFF283044)
val SakugaCrimson = Color(0xFFFF4D6D)
val AmberGold = Color(0xFFF59E0B)
val TextPrimary = Color(0xFFF8FAFC)
val TextMuted = Color(0xFF94A3B8)

private val AnimeDarkColors = darkColorScheme(
    primary = SakugaCrimson,
    onPrimary = Color.White,
    secondary = AmberGold,
    onSecondary = Color(0xFF111827),
    background = ObsidianBg,
    onBackground = TextPrimary,
    surface = StudioSurface,
    onSurface = TextPrimary,
    surfaceVariant = StudioSurfaceAlt,
    onSurfaceVariant = TextMuted,
    outline = StudioBorder
)

@Composable
fun AnimeStudioTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = AnimeDarkColors,
        content = content
    )
}
