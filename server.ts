import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { SOUND_LIBRARY } from './src/data/sounds.ts';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Initialize Google AI Studio Gemini API client with required header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for graceful timeout fallback
function withTimeout<T>(promise: Promise<T>, timeoutMs = 7000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timed out, using local director fallback')), timeoutMs)
    ),
  ]);
}

// Curated Skit Templates with authentic Nigerian humor and cultural tropes
const PRESET_TEMPLATES = [
  {
    id: 'template-african-mother-whatsapp',
    title: 'African Mother WhatsApp Broadcast',
    logline: 'Mama Chinedu receives a fake voice note claiming eating noodles on Tuesday turns you into a goat.',
    category: 'African Parents',
    style: 'stickman',
    audioMode: 'both',
    soundPack: 'african_parents',
    prompt: 'Mama Chinedu barges into her son Chinedu’s room while he is cooking late-night Indomie noodles. She frantically reads an audio broadcast from "Pastor Brother Timothy" claiming noodles contain microchips, and threatens him with her slippers.',
  },
  {
    id: 'template-danfo-no-change',
    title: 'Lagos Danfo Conductor & No Change',
    logline: 'A passenger pays with a fresh 1000 Naira note and the agbero conductor threatens to drop them at the third mainland bridge.',
    category: 'Lagos Hustle',
    style: 'realworld',
    raceOrEthnicity: 'African (Nigerian - Yoruba)',
    audioMode: 'both',
    soundPack: 'street_comedy',
    prompt: 'Inside a yellow Danfo bus in Oshodi traffic. Segun hands a crisp 1000 Naira note to conductor Baba Rashidi. Conductor yells "Enter with your 100 Naira change o! Who get change here?", and dramatically whistles out the window.',
  },
  {
    id: 'template-village-people-interview',
    title: 'Village People At The Remote Job Interview',
    logline: 'An ambitious software engineer is answering the final question for a $150k US remote job when power suddenly trips and his generator coughs.',
    category: 'Village Mystery',
    style: 'stickman',
    audioMode: 'both',
    soundPack: 'nollywood_suspense',
    prompt: 'Emeka is doing a Zoom interview with a Silicon Valley recruiter. Just as he explains his microservices architecture, NEPA strikes, the I-pass-my-neighbor generator catches fire outside, and an eerie village flute echoes.',
  },
  {
    id: 'template-landlord-surprise-visit',
    title: 'Lagos Landlord vs Tech Bro',
    logline: 'Landlord Chief Ojo visits the apartment unannounced because he saw two ACs running and assumed the tenant is mining cryptocurrency.',
    category: 'Comedy Drama',
    style: 'realworld',
    raceOrEthnicity: 'African (Nigerian - Igbo/Yoruba)',
    audioMode: 'both',
    soundPack: 'amapiano_bounce',
    prompt: 'Chief Ojo walks into Femi’s apartment wearing a heavy Agbada and holding a giant rent ledger. He sees two computer monitors and accuses Femi of turning the bedroom into a federal telecommunications exchange.',
  },
];

// Fallback high-quality skits in case Gemini API key is missing or quota is exceeded
function generateFallbackSkit(
  prompt: string,
  style: 'stickman' | 'realworld',
  raceOrEthnicity: string = 'African (Nigerian)',
  audioMode: 'both' | 'audio_only' | 'subtitles_only' = 'both',
  soundPack: string = 'all_mix'
) {
  const isStickman = style === 'stickman';
  return {
    id: 'skit-' + Date.now(),
    title: prompt ? `Skit: ${prompt.slice(0, 32)}...` : 'The Urgent Meeting at Ojuelegba',
    logline: prompt || 'An epic encounter filled with sudden Nigerian comedy twists and dramatic Nollywood suspense.',
    style,
    raceSetting: isStickman ? 'Stickman Comedy World' : raceOrEthnicity,
    audioMode,
    soundPack,
    totalDurationSeconds: 22,
    characters: [
      {
        name: 'Broda Jude',
        role: 'Protagonist / Comedian',
        raceOrStyle: isStickman ? 'Stick Figure with Red Cap' : raceOrEthnicity,
        voicePitch: 1.15,
        color: '#f59e0b',
      },
      {
        name: 'Mama Nkechi',
        role: 'Dramatic Elder / Mother',
        raceOrStyle: isStickman ? 'Stick Figure with Head Tie' : raceOrEthnicity,
        voicePitch: 0.9,
        color: '#10b981',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'The Suspicious Discovery',
        visualDescription: isStickman
          ? 'Stick figure Jude is casually standing while Mama Nkechi approaches holding a giant broomstick with animated anger marks.'
          : `A colorful Nigerian living room with lace curtain covers. An elder in traditional Ankara head tie confronts a youth staring at his smartphone.`,
        backgroundSetting: 'Nigerian Living Room with family photos and vintage wall clock',
        cameraAngle: 'two_shot',
        stickmanPoses: {
          character1Pose: 'talking',
          character2Pose: 'shocked',
          propInHand: 'Broomstick / Slippers',
        },
        realisticVisualPrompt: `Cinematic close-up portrait of two ${raceOrEthnicity} individuals having an expressive comedic argument in a Lagos apartment, 8k resolution, warm Nollywood lighting.`,
        dialogueLines: [
          {
            speaker: 'Mama Nkechi',
            text: 'Jude! Come here! Why is the pot of jollof rice crying inside the fridge?!',
            pidginOrEnglish: 'Jude! Wetin do the jollof rice? Why you leave empty pot put back?!',
            mood: 'furious',
            startOffset: 0.5,
            duration: 3.0,
            soundEffectCue: 'sfx-loud-slap',
          },
          {
            speaker: 'Broda Jude',
            text: 'Mommy I swear, it was the cat from next door! The cat has keys!',
            pidginOrEnglish: 'Mummy no be me o! Neighbor cat don learn how to open fridge!',
            mood: 'panicked',
            startOffset: 3.8,
            duration: 2.8,
            soundEffectCue: 'sfx-record-scratch',
          },
        ],
        soundEffects: [
          {
            soundId: 'sfx-loud-slap',
            name: 'African Mother Slap',
            timingSeconds: 1.2,
            triggerDescription: 'Mama Nkechi smacks Jude with her slippers',
            volume: 0.85,
          },
          {
            soundId: 'sfx-record-scratch',
            name: 'Record Scratch Freeze',
            timingSeconds: 4.5,
            triggerDescription: 'Jude freezes after the ridiculous cat excuse',
            volume: 0.7,
          },
        ],
        bgmTrack: {
          genre: 'Afrobeat Comedy',
          vibe: 'Suspicious & Bouncy',
          bpm: 110,
        },
        sceneDurationSeconds: 7,
      },
      {
        sceneNumber: 2,
        title: 'Village People Theme Interlude',
        visualDescription: isStickman
          ? 'Dark clouds swirl above stick figure Jude. Eyes glow mysteriously from the ceiling corner as wind blows paper around.'
          : `Lighting dims dramatically to deep blue. Shadows flicker across the wall as an ancestral Nollywood flute resonates.`,
        backgroundSetting: 'Dimly lit mysterious hallway with dramatic shadows',
        cameraAngle: 'dramatic_zoom',
        stickmanPoses: {
          character1Pose: 'shocked',
          character2Pose: 'falling',
          propInHand: 'Mystic calabash',
        },
        realisticVisualPrompt: `Dramatic suspenseful camera push-in on an expressive face with sudden realization, dramatic cinematic shadows, Nollywood thriller vibe.`,
        dialogueLines: [
          {
            speaker: 'Mama Nkechi',
            text: 'Cat has keys?! The village people have finally entered through 5G network!',
            pidginOrEnglish: 'Chai! Village people don hack our house through Wi-Fi!',
            mood: 'suspicious',
            startOffset: 0.8,
            duration: 3.5,
            soundEffectCue: 'sfx-nollywood-suspense',
          },
          {
            speaker: 'Broda Jude',
            text: 'Mommy hold on, I hear a mysterious flute playing from inside the air conditioner...',
            pidginOrEnglish: 'Mummy wait... you dey hear that village flute too?!',
            mood: 'panicked',
            startOffset: 4.5,
            duration: 2.5,
            soundEffectCue: 'sfx-village-people',
          },
        ],
        soundEffects: [
          {
            soundId: 'sfx-nollywood-suspense',
            name: 'Nollywood Dramatic Suspense',
            timingSeconds: 0.5,
            triggerDescription: 'Tense organ chords play as Mama Nkechi gasps',
            volume: 0.9,
          },
          {
            soundId: 'sfx-village-people',
            name: 'Village People Theme Flute',
            timingSeconds: 4.2,
            triggerDescription: 'Eerie traditional flute cues the village people',
            volume: 0.75,
          },
        ],
        bgmTrack: {
          genre: 'Nollywood Mystery',
          vibe: 'Eerie & Suspenseful',
          bpm: 85,
        },
        sceneDurationSeconds: 8,
      },
      {
        sceneNumber: 3,
        title: 'The Great Plot Twist & Danfo Escape',
        visualDescription: isStickman
          ? 'Stick figure Jude bolts in comedic running cycle out the window. Mama Nkechi does a victory dance while cheering.'
          : `Comedic high-speed chase into the sunny street with yellow Danfo buses honking and laughing bystanders.`,
        backgroundSetting: 'Lagos street with yellow buses, street food stalls, and bustling energy',
        cameraAngle: 'wide_shot',
        stickmanPoses: {
          character1Pose: 'running',
          character2Pose: 'dancing',
          propInHand: 'Megaphone',
        },
        realisticVisualPrompt: `Vibrant sunny Lagos street scene with Danfo yellow minivans, high energy comedy chase, laughing crowd, bright West African sunlight.`,
        dialogueLines: [
          {
            speaker: 'Broda Jude',
            text: 'I am travelling to Ghana on foot! Goodbye everybody!',
            pidginOrEnglish: 'I dey run enter Ghana by leg! Wahala no dey finish!',
            mood: 'hilarious',
            startOffset: 0.4,
            duration: 2.8,
            soundEffectCue: 'sfx-e-shock-you',
          },
          {
            speaker: 'Mama Nkechi',
            text: 'E shock you! Make you drop my pot lid before you cross the border!',
            pidginOrEnglish: 'E shock you! Drop my pot lid before you enter border!',
            mood: 'hilarious',
            startOffset: 3.4,
            duration: 2.6,
            soundEffectCue: 'sfx-laugh-meme',
          },
        ],
        soundEffects: [
          {
            soundId: 'sfx-e-shock-you',
            name: 'E Shock You! / Revelation',
            timingSeconds: 0.5,
            triggerDescription: 'Jude dives out the window with the pot lid',
            volume: 0.85,
          },
          {
            soundId: 'sfx-danfo-whistle',
            name: 'Lagos Danfo Conductor Whistle',
            timingSeconds: 2.8,
            triggerDescription: 'Danfo conductor whistles at Jude running past',
            volume: 0.8,
          },
          {
            soundId: 'sfx-laugh-meme',
            name: 'Naija Skit Laughing Meme',
            timingSeconds: 4.8,
            triggerDescription: 'Viral comedy laughter wraps up the skit',
            volume: 0.9,
          },
        ],
        bgmTrack: {
          genre: 'Amapiano Log Drum Groove',
          vibe: 'Celebratory & Viral',
          bpm: 114,
        },
        sceneDurationSeconds: 7,
      },
    ],
    createdAt: new Date().toISOString(),
  };
}

// 1. Get sound library
app.get('/api/sounds', (_req: Request, res: Response) => {
  res.json({ sounds: SOUND_LIBRARY });
});

// 2. Get preset skit templates
app.get('/api/templates', (_req: Request, res: Response) => {
  res.json({ templates: PRESET_TEMPLATES });
});

// 3. AI Prompt Enhancer: spices raw prompt with authentic Nigerian humor and slang
app.post('/api/skits/enhance-prompt', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  try {
    if (!apiKey) {
      res.json({
        enhancedPrompt: `${prompt} — Added with intense Nigerian comedic flavor: sudden maternal accusations, an unexpected village people conspiracy, and dramatic Danfo conductor intervention with high-speed shoe removal.`,
      });
      return;
    }

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `You are an award-winning Nigerian comedy skit writer (creator of viral Instagram, YouTube, and TikTok skits).
Take this basic skit idea: "${prompt}"
Enhance it into a hilarious, punchy, culturally rich skit premise (2-3 sentences) featuring recognizable Nigerian comedic tropes, vivid dialogue triggers, and relatable punchlines (e.g., Nigerian parents, Lagos traffic/Danfo, tech bro realities, village people, WhatsApp gossip). Keep it brief, punchy, and cinematic.`,
      }),
      6000
    );

    res.json({ enhancedPrompt: response.text?.trim() || prompt });
  } catch (error: unknown) {
    console.error('Enhance prompt error:', error);
    res.json({
      enhancedPrompt: `${prompt} with dramatic Nollywood suspense twists and classic Nigerian comedy punchlines.`,
    });
  }
});

// 4. Generate Skit: Full structured scene breakdown with synchronized audio and sound effects
app.post('/api/skits/generate', async (req: Request, res: Response) => {
  const {
    prompt,
    style = 'stickman',
    raceOrEthnicity = 'African (Nigerian)',
    audioMode = 'both',
    soundPack = 'all_mix',
    tone = 'comedic_drama',
    language = 'mixed',
  } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  try {
    if (!apiKey) {
      console.log('No GEMINI_API_KEY set, generating structured fallback skit.');
      const fallback = generateFallbackSkit(prompt, style, raceOrEthnicity, audioMode, soundPack);
      res.json({ skit: fallback });
      return;
    }

    const soundIdsList = SOUND_LIBRARY.map((s) => `"${s.id}" (${s.name})`).join(', ');

    const systemPrompt = `You are an expert full-stack director and comedic screenwriter for short viral skits and animations.
Your task is to generate a complete, structured skit script with synchronized audio cues, sound effect timestamps, subtitles, and scene visuals.

Style requested: ${style === 'stickman' ? 'Stick Man World (minimalist ball head, stick body, comic props, slapstick gestures)' : `Real World Cinematic (${raceOrEthnicity})`}
Audio Mode: ${audioMode} (both = dialogue audio + subtitles, audio_only = sound only, subtitles_only = text only)
Preferred Sound Pack: ${soundPack}
Tone: ${tone}
Language/Dialect: ${language} (Mix authentic Nigerian Pidgin with English, full of lively expressions like "Chai!", "Wetin be this?!", "Wahala dey!", "E shock you!", "You dey mad?", "God forbid!")

AVAILABLE SOUND EFFECT IDS TO ASSIGN:
${soundIdsList}

INSTRUCTIONS:
1. Provide 3 distinct sequential scenes (total runtime 18 to 26 seconds).
2. For each scene:
   - Provide visual description and specific stickmanPoses (or realistic visual prompt).
   - Provide 2-3 dialogue lines with speaker, text, pidginOrEnglish translation/subtitle, mood, startOffset (seconds from scene start), duration (seconds), and matching soundEffectCue.
   - Assign 1-2 synchronized sound effects using the exact soundIds provided above, with exact timingSeconds within that scene.
   - Specify BGM track vibe and BPM.
3. Return valid JSON only, complying strictly with the requested schema.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Create a hilarious, memorable skit based on this storyline: "${prompt}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            logline: { type: Type.STRING },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  raceOrStyle: { type: Type.STRING },
                  voicePitch: { type: Type.NUMBER },
                  color: { type: Type.STRING },
                },
                required: ['name', 'role', 'raceOrStyle', 'voicePitch', 'color'],
              },
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  visualDescription: { type: Type.STRING },
                  backgroundSetting: { type: Type.STRING },
                  cameraAngle: {
                    type: Type.STRING,
                    enum: ['close_up', 'wide_shot', 'two_shot', 'over_the_shoulder', 'dramatic_zoom'],
                  },
                  stickmanPoses: {
                    type: Type.OBJECT,
                    properties: {
                      character1Pose: {
                        type: Type.STRING,
                        enum: ['standing', 'talking', 'shocked', 'slapping', 'dancing', 'running', 'falling'],
                      },
                      character2Pose: {
                        type: Type.STRING,
                        enum: ['standing', 'talking', 'shocked', 'slapping', 'dancing', 'running', 'falling'],
                      },
                      propInHand: { type: Type.STRING },
                    },
                    required: ['character1Pose', 'character2Pose'],
                  },
                  realisticVisualPrompt: { type: Type.STRING },
                  dialogueLines: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        speaker: { type: Type.STRING },
                        text: { type: Type.STRING },
                        pidginOrEnglish: { type: Type.STRING },
                        mood: {
                          type: Type.STRING,
                          enum: ['furious', 'hilarious', 'suspicious', 'panicked', 'calm', 'sarcastic'],
                        },
                        startOffset: { type: Type.NUMBER },
                        duration: { type: Type.NUMBER },
                        soundEffectCue: { type: Type.STRING },
                      },
                      required: ['speaker', 'text', 'pidginOrEnglish', 'mood', 'startOffset', 'duration'],
                    },
                  },
                  soundEffects: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        soundId: { type: Type.STRING },
                        name: { type: Type.STRING },
                        timingSeconds: { type: Type.NUMBER },
                        triggerDescription: { type: Type.STRING },
                        volume: { type: Type.NUMBER },
                      },
                      required: ['soundId', 'name', 'timingSeconds', 'triggerDescription', 'volume'],
                    },
                  },
                  bgmTrack: {
                    type: Type.OBJECT,
                    properties: {
                      genre: { type: Type.STRING },
                      vibe: { type: Type.STRING },
                      bpm: { type: Type.NUMBER },
                    },
                    required: ['genre', 'vibe', 'bpm'],
                  },
                  sceneDurationSeconds: { type: Type.NUMBER },
                },
                required: [
                  'sceneNumber',
                  'title',
                  'visualDescription',
                  'backgroundSetting',
                  'cameraAngle',
                  'stickmanPoses',
                  'realisticVisualPrompt',
                  'dialogueLines',
                  'soundEffects',
                  'bgmTrack',
                  'sceneDurationSeconds',
                ],
              },
            },
          },
          required: ['title', 'logline', 'characters', 'scenes'],
        },
      },
    }),
    8000
  );

    let parsed: {
      title?: string;
      logline?: string;
      characters?: { name: string; role: string; raceOrStyle: string; voicePitch: number; color: string }[];
      scenes?: any[];
    } = {};

    try {
      parsed = JSON.parse(response.text || '{}');
    } catch (parseErr) {
      console.warn('Failed to parse Gemini response as JSON, falling back:', parseErr);
    }

    if (!parsed.scenes || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
      console.log('Gemini returned empty scenes array, using fallback skit.');
      const fallback = generateFallbackSkit(prompt, style, raceOrEthnicity, audioMode, soundPack);
      res.json({ skit: fallback });
      return;
    }

    const totalDuration = (parsed.scenes || []).reduce(
      (acc: number, sc: { sceneDurationSeconds: number }) => acc + (sc.sceneDurationSeconds || 7),
      0
    );

    const completeSkit = {
      id: 'skit-' + Date.now(),
      title: parsed.title || 'Untitled Skit',
      logline: parsed.logline || prompt,
      style,
      raceSetting: style === 'stickman' ? 'Stickman World' : raceOrEthnicity,
      audioMode,
      soundPack,
      totalDurationSeconds: totalDuration,
      characters: parsed.characters || [],
      scenes: parsed.scenes || [],
      createdAt: new Date().toISOString(),
    };

    res.json({ skit: completeSkit });
  } catch (error: unknown) {
    console.error('Gemini Skit generation error:', error);
    // Graceful fallback to guarantee smooth UI experience
    const fallback = generateFallbackSkit(prompt, style, raceOrEthnicity, audioMode, soundPack);
    res.json({ skit: fallback, warning: 'Generated using local comedic director template due to network availability.' });
  }
});

// 5. Anime Video & Audio Health Check (for Native Android APK & Web clients)
app.get('/api/anime/health', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: 'AnimeStudio Gemini Backend',
    hasApiKey: Boolean(apiKey),
    models: {
      director: 'gemini-4-hydrogen',
      video: 'gemini-omni-1.2-flash',
      voice: 'gemini-3.8-flash-tts',
      music: 'lyria-3-clip-preview',
    },
  });
});

// 6. Generate Anime Video with Synchronized Audio Output (Voiceover + Soundtrack)
app.post('/api/anime/generate', async (req: Request, res: Response) => {
  const {
    prompt,
    animeStyle = 'modern_shonen',
    aspectRatio = '16:9',
    durationSeconds = 8,
    audioMode = 'full',
    voicePersona = 'dramatic_hero',
    musicVibe = 'epic_orchestral_synth',
  } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'Anime scene prompt is required.' });
    return;
  }

  if (!apiKey) {
    res.status(400).json({
      error:
        'GEMINI_API_KEY is not configured on the server. Set a billing-enabled Gemini API key in Settings > Secrets to generate anime video and audio.',
    });
    return;
  }

  const clampedDuration = Math.min(15, Math.max(3, Math.round(Number(durationSeconds) || 8)));
  const safeAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

  const styleDescriptions: Record<string, string> = {
    modern_shonen:
      'High-budget modern Japanese shonen anime cinema, dynamic sakuga keyframe animation, crisp cel-shading, dramatic rim lighting, fluid particle effects, ufotable/MAPPA inspired visual quality',
    ghibli_painterly:
      'Lush hand-painted watercolor anime film aesthetic, warm golden hour sunlight, billowing clouds, nostalgic countryside atmosphere, expressive character acting',
    retro_90s_ova:
      'Classic 1990s hand-drawn cel-shaded anime OVA aesthetic, subtle film grain, rich shadow hatching, vintage VHS broadcast color grading, sharp linework',
    cyberpunk_mecha:
      'High-contrast cyberpunk mecha anime cinema, rain-slicked Neo-Tokyo reflections, glowing HUD reflections, sleek mechanical detailing, cinematic anamorphic framing',
  };

  const voiceDescriptions: Record<string, { voice: string; style: string }> = {
    dramatic_hero: {
      voice: 'Puck',
      style: 'Passionate, determined anime protagonist delivering an emotional line',
    },
    calm_mentor: {
      voice: 'Charon',
      style: 'Deep, composed, wise anime sensei speaking with gravitas',
    },
    energetic_rival: {
      voice: 'Fenrir',
      style: 'Intense, fiery anime rival with sharp dramatic pacing',
    },
    narrator_female: {
      voice: 'Kore',
      style: 'Expressive, clear anime storyteller and narrator',
    },
  };

  try {
    // Step 1: Use gemini-4-hydrogen to craft an anime video prompt, dialogue line, and music prompt
    const directorResponse = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Create a cohesive ${clampedDuration}-second anime scene plan from this idea: "${prompt.trim()}".
Visual style: ${styleDescriptions[animeStyle] || styleDescriptions.modern_shonen}.
Music vibe: ${musicVibe}.`,
      config: {
        systemInstruction:
          'You are an acclaimed Japanese anime film director and sound designer. Return concise, vivid production JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            videoPrompt: {
              type: Type.STRING,
              description:
                'Detailed visual motion prompt for anime video generation including camera movement, character animation, lighting, and atmosphere.',
            },
            dialogueLine: {
              type: Type.STRING,
              description:
                'Short dramatic spoken anime line (1-2 sentences, under 22 words) fitting within the clip duration.',
            },
            speakerName: { type: Type.STRING },
            musicPrompt: {
              type: Type.STRING,
              description: 'Prompt for a 30-second anime soundtrack matching the scene emotion and tempo.',
            },
          },
          required: ['title', 'videoPrompt', 'dialogueLine', 'speakerName', 'musicPrompt'],
        },
      },
    });

    let plan = {
      title: 'Anime Scene',
      videoPrompt: `${styleDescriptions[animeStyle] || styleDescriptions.modern_shonen}. ${prompt.trim()}. Smooth 24fps anime character motion, dramatic camera push-in, atmospheric particles, synchronized ambient audio.`,
      dialogueLine: 'No matter how dark the night becomes, our resolve will ignite the sky!',
      speakerName: 'Protagonist',
      musicPrompt: `Dynamic anime soundtrack in ${musicVibe.replace(/_/g, ' ')} style, emotional strings, taiko percussion, cinematic swell.`,
    };

    try {
      const parsedPlan = JSON.parse(directorResponse.text || '{}');
      if (parsedPlan.videoPrompt) {
        plan = {
          title: parsedPlan.title || plan.title,
          videoPrompt: `${styleDescriptions[animeStyle] || styleDescriptions.modern_shonen}. ${parsedPlan.videoPrompt}`,
          dialogueLine: parsedPlan.dialogueLine || plan.dialogueLine,
          speakerName: parsedPlan.speakerName || plan.speakerName,
          musicPrompt: parsedPlan.musicPrompt || plan.musicPrompt,
        };
      }
    } catch {
      // Keep fallback plan derived from user prompt
    }

    // Step 2: Generate Anime Video using gemini-omni-1.2-flash (Interactions API)
    const videoPromise = ai.interactions.create(
      {
        model: 'gemini-omni-1.2-flash',
        input: plan.videoPrompt,
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: safeAspectRatio,
          duration: `${clampedDuration}s`,
          resolution: '720p',
        },
      },
      { timeout: 300000 }
    );

    const includeVoice = audioMode === 'full' || audioMode === 'voice_only';
    const includeMusic = audioMode === 'full' || audioMode === 'music_only';
    const selectedVoice = voiceDescriptions[voicePersona] || voiceDescriptions.dramatic_hero;

    // Step 3: Generate Character Voiceover WAV (gemini-3.8-flash-tts)
    const voicePromise = includeVoice
      ? ai.interactions
          .create({
            model: 'gemini-3.8-flash-tts',
            input: [
              {
                type: 'text',
                text: `${plan.speakerName}: ${plan.dialogueLine}`,
                annotations: [
                  {
                    type: 'speech_metadata',
                    speaker: plan.speakerName,
                    style: selectedVoice.style,
                  },
                ],
              },
            ],
            response_format: { type: 'audio' },
            generation_config: {
              speech_config: {
                speakers: [
                  {
                    speaker: plan.speakerName,
                    voice: selectedVoice.voice,
                  },
                ],
              },
            },
          })
          .catch((err) => {
            console.warn('TTS audio generation warning:', err);
            return null;
          })
      : Promise.resolve(null);

    // Step 4: Generate Anime Soundtrack WAV (lyria-3-clip-preview)
    const musicPromise = includeMusic
      ? (async () => {
          try {
            const stream = await ai.models.generateContentStream({
              model: 'lyria-3-clip-preview',
              contents: plan.musicPrompt,
            });
            let audioBase64 = '';
            let mimeType = 'audio/wav';
            for await (const chunk of stream) {
              const parts = chunk.candidates?.[0]?.content?.parts;
              if (!parts) continue;
              for (const part of parts) {
                if (part.inlineData?.data) {
                  if (!audioBase64 && part.inlineData.mimeType) {
                    mimeType = part.inlineData.mimeType;
                  }
                  audioBase64 += part.inlineData.data;
                }
              }
            }
            return audioBase64 ? { data: audioBase64, mimeType } : null;
          } catch (err) {
            console.warn('Lyria soundtrack generation warning:', err);
            return null;
          }
        })()
      : Promise.resolve(null);

    const [videoInteraction, voiceInteraction, musicResult] = await Promise.all([
      videoPromise,
      voicePromise,
      musicPromise,
    ]);

    const videoPart = videoInteraction.output_video;
    if (!videoPart?.data) {
      res.status(502).json({
        error: 'Video model completed without returning video bytes. Please retry with a different prompt.',
      });
      return;
    }

    const voicePart = voiceInteraction?.output_audio;

    res.json({
      title: plan.title,
      directorPrompt: plan.videoPrompt,
      speakerName: plan.speakerName,
      dialogueLine: plan.dialogueLine,
      durationSeconds: clampedDuration,
      aspectRatio: safeAspectRatio,
      animeStyle,
      videoBase64: videoPart.data,
      videoMimeType: videoPart.mime_type || 'video/mp4',
      voiceAudioBase64: voicePart?.data || null,
      voiceMimeType: voicePart?.mime_type || 'audio/wav',
      musicAudioBase64: musicResult?.data || null,
      musicMimeType: musicResult?.mimeType || 'audio/wav',
    });
  } catch (error: unknown) {
    console.error('Anime video generation error:', error);
    const errObj = error as { status?: number; message?: string };
    const status = typeof errObj?.status === 'number' ? errObj.status : 500;
    let message = errObj?.message || 'Failed to generate anime video and audio.';

    if (status === 403 || status === 400) {
      message = `${message} Ensure a valid paid GEMINI_API_KEY is configured in Settings > Secrets.`;
    } else if (status === 429) {
      message = `${message} Quota exceeded — verify your billing-enabled API key in Settings > Secrets.`;
    }

    res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
  }
});

// Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`NaijaSkits Studio server running at http://0.0.0.0:${port}`);
  });
}

startServer();
