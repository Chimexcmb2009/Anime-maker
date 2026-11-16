export interface SoundEffect {
  id: string;
  name: string;
  category: 'nigerian' | 'cinematic' | 'comedy' | 'afrobeat';
  description: string;
  tag: string;
  duration: number; // in seconds
  icon: string;
  synthType:
    | 'nollywood_suspense'
    | 'slap_impact'
    | 'chai_shout'
    | 'e_shock_you'
    | 'log_drum'
    | 'village_people_flute'
    | 'record_scratch'
    | 'danfo_whistle'
    | 'church_organ'
    | 'laugh_track'
    | 'cartoon_boing'
    | 'awkward_crickets'
    | 'dramatic_thud'
    | 'cheer_applause'
    | 'rimshot_comedy'
    | 'afro_groove_loop';
}

export const SOUND_LIBRARY: SoundEffect[] = [
  // --- NIGERIAN COMEDY & NOLLYWOOD SOUNDS ---
  {
    id: 'sfx-nollywood-suspense',
    name: 'Nollywood Dramatic Suspense',
    category: 'nigerian',
    description: 'Iconic suspenseful organ & violin tritone played when village people strike or secret is revealed.',
    tag: 'Classic Drama',
    duration: 3.2,
    icon: '⚡',
    synthType: 'nollywood_suspense',
  },
  {
    id: 'sfx-loud-slap',
    name: 'African Mother Slap',
    category: 'nigerian',
    description: 'Sharp, resonant slap sound effect accompanied by comedic windup and ringing impact.',
    tag: 'Discipline',
    duration: 1.5,
    icon: '💥',
    synthType: 'slap_impact',
  },
  {
    id: 'sfx-chai-ewoo',
    name: 'Chai! / Ewoo! Vocal Shock',
    category: 'nigerian',
    description: 'Synthesized exclamation sound for sudden disbelief, gossip, or total heartbreak.',
    tag: 'Disbelief',
    duration: 2.1,
    icon: '😱',
    synthType: 'chai_shout',
  },
  {
    id: 'sfx-e-shock-you',
    name: 'E Shock You! / Revelation',
    category: 'nigerian',
    description: 'High energy rising pitch drop stinger used when an unexpected twist lands in Naija skits.',
    tag: 'Plot Twist',
    duration: 2.0,
    icon: '👀',
    synthType: 'e_shock_you',
  },
  {
    id: 'sfx-village-people',
    name: 'Village People Theme Flute',
    category: 'nigerian',
    description: 'Eerie traditional flute sound signaling mysterious spiritual interference in business or visa interview.',
    tag: 'Spiritual Mystery',
    duration: 3.5,
    icon: '🪈',
    synthType: 'village_people_flute',
  },
  {
    id: 'sfx-danfo-whistle',
    name: 'Lagos Danfo Conductor Whistle',
    category: 'nigerian',
    description: 'Piercing dual-tone metal whistle and bus banging rhythm typical of Oshodi and CMS bus stops.',
    tag: 'Lagos Street',
    duration: 2.4,
    icon: '🚌',
    synthType: 'danfo_whistle',
  },
  {
    id: 'sfx-church-organ',
    name: 'Naija Church Organ Chord Crash',
    category: 'nigerian',
    description: 'Gospel organ flourish and sudden brass crash played during spontaneous testimonies.',
    tag: 'Testimony',
    duration: 3.0,
    icon: '🎹',
    synthType: 'church_organ',
  },
  {
    id: 'sfx-amapiano-logdrum',
    name: 'Amapiano / Afrobeat Log Drum',
    category: 'afrobeat',
    description: 'Deep resonant sub-bass bounce kick that makes any comedic moment instantly danceable.',
    tag: 'Groove',
    duration: 2.5,
    icon: '🥁',
    synthType: 'log_drum',
  },
  {
    id: 'sfx-afrobeat-loop',
    name: 'Naija Comedy Afro-BGM Groove',
    category: 'afrobeat',
    description: 'Lighthearted comedy background beat with syncopated shaker, talking drum, and bouncy guitar.',
    tag: 'Background Beat',
    duration: 4.8,
    icon: '🎶',
    synthType: 'afro_groove_loop',
  },

  // --- COMEDY & CINEMATIC SOUNDS ---
  {
    id: 'sfx-record-scratch',
    name: 'Record Scratch Freeze',
    category: 'comedy',
    description: 'Sudden turntable vinyl scratch when someone says something totally awkward.',
    tag: 'Awkward Stop',
    duration: 1.2,
    icon: '💿',
    synthType: 'record_scratch',
  },
  {
    id: 'sfx-laugh-meme',
    name: 'Naija Skit Laughing Meme',
    category: 'comedy',
    description: 'Infectious rapid laughing burst popularized in viral TikTok and Instagram comedy skits.',
    tag: 'Laughter',
    duration: 2.8,
    icon: '😂',
    synthType: 'laugh_track',
  },
  {
    id: 'sfx-cartoon-boing',
    name: 'Comic Jump / Boing',
    category: 'comedy',
    description: 'Bouncy spring boing sound for stick man jumps, head bonks, and comical surprise.',
    tag: 'Stickman Comic',
    duration: 1.4,
    icon: '🦘',
    synthType: 'cartoon_boing',
  },
  {
    id: 'sfx-rimshot',
    name: 'Comedy Rimshot (Ba-Dum-Tss)',
    category: 'comedy',
    description: 'Classic comedic drum punchline accent.',
    tag: 'Punchline',
    duration: 1.6,
    icon: '🥁',
    synthType: 'rimshot_comedy',
  },
  {
    id: 'sfx-awkward-crickets',
    name: 'Awkward Silence Crickets',
    category: 'comedy',
    description: 'Chirping crickets when a joke lands completely flat or parents stare in dead silence.',
    tag: 'Dead Silence',
    duration: 2.6,
    icon: '🦗',
    synthType: 'awkward_crickets',
  },
  {
    id: 'sfx-dramatic-thud',
    name: 'Cinematic Sub-Drop Thud',
    category: 'cinematic',
    description: 'Deep cinematic impact thud for dramatic title drops or fainting characters.',
    tag: 'Deep Impact',
    duration: 2.0,
    icon: '🎬',
    synthType: 'dramatic_thud',
  },
  {
    id: 'sfx-cheer-applause',
    name: 'Victorious Crowd Cheers',
    category: 'cinematic',
    description: 'Energetic applause and celebration whistles for a triumphant skit ending.',
    tag: 'Victory',
    duration: 3.0,
    icon: '👏',
    synthType: 'cheer_applause',
  },
];

export interface SkitScene {
  sceneNumber: number;
  title: string;
  visualDescription: string;
  backgroundSetting: string;
  cameraAngle: 'close_up' | 'wide_shot' | 'two_shot' | 'over_the_shoulder' | 'dramatic_zoom';
  stickmanPoses: {
    character1Pose: 'standing' | 'talking' | 'shocked' | 'slapping' | 'dancing' | 'running' | 'falling';
    character2Pose: 'standing' | 'talking' | 'shocked' | 'slapping' | 'dancing' | 'running' | 'falling';
    propInHand?: string;
  };
  realisticVisualPrompt: string;
  dialogueLines: {
    speaker: string;
    text: string;
    pidginOrEnglish: string;
    mood: 'furious' | 'hilarious' | 'suspicious' | 'panicked' | 'calm' | 'sarcastic';
    startOffset: number; // seconds
    duration: number; // seconds
    soundEffectCue?: string;
  }[];
  soundEffects: {
    soundId: string;
    name: string;
    timingSeconds: number;
    triggerDescription: string;
    volume: number;
  }[];
  bgmTrack: {
    genre: string;
    vibe: string;
    bpm: number;
  };
  sceneDurationSeconds: number;
}

export interface GeneratedSkit {
  id: string;
  title: string;
  logline: string;
  style: 'stickman' | 'realworld';
  raceSetting?: string;
  audioMode: 'both' | 'audio_only' | 'subtitles_only';
  soundPack: string;
  totalDurationSeconds: number;
  characters: {
    name: string;
    role: string;
    raceOrStyle: string;
    voicePitch: number;
    color: string;
  }[];
  scenes: SkitScene[];
  createdAt: string;
}
