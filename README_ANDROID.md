# AnimeStudio Native Android APK & GitHub Actions Builder

This repository includes a complete native **Kotlin + Jetpack Compose + Media3 ExoPlayer** Android app under `android-app/` and an automated **GitHub Actions** workflow (`.github/workflows/build-android-apk.yml`) that compiles real `.apk` files in the cloud.

## 1. Build a Downloadable `.apk` via GitHub Actions (No Android Studio Required)

1. Export or push this repository to GitHub (on `main` or `master`).
2. Open your repository on GitHub and click the **Actions** tab.
3. Wait for the **Build Android APK** workflow to finish (or trigger it manually via **Run workflow**).
4. Scroll down to **Artifacts** on the workflow summary page and download:
   - `AnimeStudio-debug-apk` (`app-debug.apk`)
   - `AnimeStudio-release-apk` (`app-release.apk`, debug-signed for immediate sideloading)
5. Transfer the `.apk` to your Android phone and tap it to install (enable **Install unknown apps** when prompted).

## 2. Build Locally in Android Studio

1. Open the `android-app/` folder in **Android Studio** (Ladybug or newer).
2. Let Gradle sync (AGP `8.7.3`, Gradle `8.10.2`, Kotlin `2.0.21`, compileSdk `35`).
3. Click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

## 3. Backend Video & Audio Server Setup

The Android app calls `/api/anime/generate` on your Node/Express server (`server.ts`), which keeps your `GEMINI_API_KEY` securely on the server and uses:
- `gemini-4-hydrogen` — anime scene & dialogue director
- `gemini-omni-1.2-flash` — anime MP4 video generation (paid API key required)
- `gemini-3.8-flash-tts` — character voiceover WAV generation
- `lyria-3-clip-preview` — anime BGM soundtrack WAV generation (paid API key required)

Inside the Android app, tap the top-right **Settings** gear icon to verify or change the backend server URL (pre-configured to your Shared App URL).
