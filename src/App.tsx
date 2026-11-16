import React, { useState } from 'react';
import { GeneratedSkit } from './data/sounds.ts';
import { SkitCreator } from './components/SkitCreator.tsx';
import { SkitPlayer } from './components/SkitPlayer.tsx';
import { Soundboard } from './components/Soundboard.tsx';
import { PWAInstallButton } from './components/PWAInstallButton.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import {
  Film,
  PlusCircle,
  PlaySquare,
  Volume2,
  Sparkles,
  Smartphone,
  Share2,
} from 'lucide-react';

// Default featured skit on initial launch so the creator can immediately test playback, animations, and sound effects!
const INITIAL_DEMO_SKIT: GeneratedSkit = {
  id: 'skit-demo-african-mother',
  title: 'The Great Indomie Conspiracy',
  logline: 'Mama Chinedu catches her son cooking late-night Indomie and suspects the village people are at work.',
  style: 'stickman',
  raceSetting: 'Stickman World (African/Nigerian)',
  audioMode: 'both',
  soundPack: 'african_parents',
  totalDurationSeconds: 21,
  characters: [
    {
      name: 'Chinedu',
      role: 'Late-Night Chef',
      raceOrStyle: 'Stickman with Red Cap',
      voicePitch: 1.2,
      color: '#f59e0b',
    },
    {
      name: 'Mama Chinedu',
      role: 'Suspicious Mother',
      raceOrStyle: 'Stickman with Gele Headtie',
      voicePitch: 0.85,
      color: '#10b981',
    },
  ],
  scenes: [
    {
      sceneNumber: 1,
      title: 'Midnight Kitchen Encounter',
      visualDescription: 'Chinedu is sneakily boiling water on the gas cooker when Mama Chinedu bursts into the room.',
      backgroundSetting: 'Lagos Kitchen at 2:00 AM with boiling water steam',
      cameraAngle: 'two_shot',
      stickmanPoses: {
        character1Pose: 'talking',
        character2Pose: 'slapping',
        propInHand: 'Broomstick',
      },
      realisticVisualPrompt: 'African mother in traditional head wrap confronting her teenage son in a Lagos kitchen at 2am.',
      dialogueLines: [
        {
          speaker: 'Mama Chinedu',
          text: 'Chinedu! Look at the time! Are you cooking sacrifice for the village elders?!',
          pidginOrEnglish: 'Chinedu! Wetin you dey cook by 2 AM?! You dey feed spirit?!',
          mood: 'furious',
          startOffset: 0.5,
          duration: 3.0,
          soundEffectCue: 'sfx-loud-slap',
        },
        {
          speaker: 'Chinedu',
          text: 'Mommy it is only Indomie! Brain food for my online mathematics exam!',
          pidginOrEnglish: 'Mummy na ordinary Indomie o! Hunger wan kill me!',
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
          triggerDescription: 'Mama Chinedu executes the iconic slippers slap',
          volume: 0.85,
        },
        {
          soundId: 'sfx-record-scratch',
          name: 'Record Scratch Freeze',
          timingSeconds: 4.5,
          triggerDescription: 'Kitchen sounds freeze as Chinedu defends himself',
          volume: 0.7,
        },
      ],
      bgmTrack: {
        genre: 'Afrobeat Comedy',
        vibe: 'Bouncy & Suspenseful',
        bpm: 110,
      },
      sceneDurationSeconds: 7,
    },
    {
      sceneNumber: 2,
      title: 'WhatsApp Broadcast Revelation',
      visualDescription: 'Mama Chinedu raises her phone showing an all-caps message with red warning emojis.',
      backgroundSetting: 'Kitchen hallway with dramatic shadow lighting',
      cameraAngle: 'dramatic_zoom',
      stickmanPoses: {
        character1Pose: 'shocked',
        character2Pose: 'talking',
        propInHand: 'Smartphone',
      },
      realisticVisualPrompt: 'Dramatic Nollywood close-up with intense lighting and shocking revelation expression.',
      dialogueLines: [
        {
          speaker: 'Mama Chinedu',
          text: 'Pastor Brother Timothy sent a WhatsApp audio: Noodles will erase your destiny!',
          pidginOrEnglish: 'Chai! Pastor Timothy broadcast say noodle seasoning get 5G network!',
          mood: 'suspicious',
          startOffset: 0.8,
          duration: 3.4,
          soundEffectCue: 'sfx-nollywood-suspense',
        },
        {
          speaker: 'Chinedu',
          text: 'Mommy, Pastor Timothy also said eating chicken makes you fly in the coven!',
          pidginOrEnglish: 'Mummy Pastor Timothy also say drinking cold water be witchcraft!',
          mood: 'sarcastic',
          startOffset: 4.4,
          duration: 2.4,
          soundEffectCue: 'sfx-village-people',
        },
      ],
      soundEffects: [
        {
          soundId: 'sfx-nollywood-suspense',
          name: 'Nollywood Dramatic Suspense',
          timingSeconds: 0.8,
          triggerDescription: 'Dramatic Nollywood tritone chord plays',
          volume: 0.9,
        },
        {
          soundId: 'sfx-village-people',
          name: 'Village People Theme Flute',
          timingSeconds: 4.5,
          triggerDescription: 'Village people flute warns against the noodles',
          volume: 0.75,
        },
      ],
      bgmTrack: {
        genre: 'Nollywood Suspense',
        vibe: 'Mysterious & Dramatic',
        bpm: 88,
      },
      sceneDurationSeconds: 7,
    },
    {
      sceneNumber: 3,
      title: 'The Great Danfo Escape',
      visualDescription: 'Chinedu grabs the cooked pot and sprints into the street while Mama cheers in victory.',
      backgroundSetting: 'Lagos street with yellow Danfo buses and laughing neighbors',
      cameraAngle: 'wide_shot',
      stickmanPoses: {
        character1Pose: 'running',
        character2Pose: 'dancing',
        propInHand: 'Pot of Noodles',
      },
      realisticVisualPrompt: 'Sunlit lively Lagos road, funny comedic chase with bright yellow minibus ambiance.',
      dialogueLines: [
        {
          speaker: 'Chinedu',
          text: 'E shock you! I am taking the noodles to Ghana!',
          pidginOrEnglish: 'E shock you! I dey carry the pot run enter Danfo bus!',
          mood: 'hilarious',
          startOffset: 0.5,
          duration: 2.8,
          soundEffectCue: 'sfx-e-shock-you',
        },
        {
          speaker: 'Mama Chinedu',
          text: 'Return my stainless pot before I disconnect your SIM card!',
          pidginOrEnglish: 'Return my wedding pot before I lock your SIM card o!',
          mood: 'hilarious',
          startOffset: 3.5,
          duration: 2.6,
          soundEffectCue: 'sfx-laugh-meme',
        },
      ],
      soundEffects: [
        {
          soundId: 'sfx-e-shock-you',
          name: 'E Shock You! / Revelation',
          timingSeconds: 0.6,
          triggerDescription: 'E shock you stinger as Chinedu escapes with the pot',
          volume: 0.85,
        },
        {
          soundId: 'sfx-danfo-whistle',
          name: 'Lagos Danfo Conductor Whistle',
          timingSeconds: 3.0,
          triggerDescription: 'Danfo bus conductor whistling on the street',
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
        genre: 'Amapiano Log Drum',
        vibe: 'Celebratory & Viral',
        bpm: 114,
      },
      sceneDurationSeconds: 7,
    },
  ],
  createdAt: new Date().toISOString(),
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'player' | 'soundboard'>('player');
  const [currentSkit, setCurrentSkit] = useState<GeneratedSkit>(INITIAL_DEMO_SKIT);
  const [isLoading, setIsLoading] = useState(false);

  const handleSkitGenerated = (skit: GeneratedSkit) => {
    setCurrentSkit(skit);
    setActiveTab('player');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 pb-20 sm:pb-8">
      {/* Offline Status Banner */}
      <OfflineIndicator />

      {/* Top Application Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('player')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Naija<span className="text-emerald-400">Skits</span>
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  AI STUDIO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                PWA Skit Creator • Stick Man & Real World • Nigerian Sounds
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('player')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'player'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PlaySquare className="w-3.5 h-3.5" />
              <span>Skit Player</span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Skit</span>
            </button>

            <button
              onClick={() => setActiveTab('soundboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'soundboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Soundboard</span>
            </button>
          </nav>

          {/* Mobile Install App Button */}
          <div className="flex items-center gap-2">
            <PWAInstallButton compact={true} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center">
        {/* TAB 1: PLAYER & STAGE */}
        {activeTab === 'player' && (
          <div className="w-full flex flex-col items-center gap-6 animate-in fade-in">
            {/* Quick Action Banner to Create New Skit */}
            <div className="w-full flex items-center justify-between bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 p-3 sm:p-4 rounded-3xl">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 text-xl shrink-0">
                  ⚡
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    Want to create your own custom skit?
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Prompt AI with any scenario, cast Stick Man or Real World actors, and sync Nigerian sound FX!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('create')}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Skit</span>
              </button>
            </div>

            {/* Skit Player */}
            <SkitPlayer skit={currentSkit} />
          </div>
        )}

        {/* TAB 2: CREATOR WORKSPACE */}
        {activeTab === 'create' && (
          <div className="w-full animate-in fade-in">
            <SkitCreator
              onSkitGenerated={handleSkitGenerated}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        )}

        {/* TAB 3: SOUNDBOARD */}
        {activeTab === 'soundboard' && (
          <div className="w-full animate-in fade-in">
            <Soundboard />
          </div>
        )}
      </main>

      {/* Mobile Floating Bottom Bar for Thumb-Friendly Touch Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('player')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-[10px] font-bold transition cursor-pointer ${
            activeTab === 'player' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PlaySquare className="w-5 h-5" />
          <span>Player</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-[10px] font-bold transition cursor-pointer ${
            activeTab === 'create' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create Skit</span>
        </button>

        <button
          onClick={() => setActiveTab('soundboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-[10px] font-bold transition cursor-pointer ${
            activeTab === 'soundboard' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span>Soundboard</span>
        </button>
      </div>
    </div>
  );
}
