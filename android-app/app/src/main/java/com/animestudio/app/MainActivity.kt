package com.animestudio.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.animestudio.app.ui.AnimeStudioScreen
import com.animestudio.app.ui.theme.AnimeStudioTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            AnimeStudioTheme {
                AnimeStudioScreen()
            }
        }
    }
}
