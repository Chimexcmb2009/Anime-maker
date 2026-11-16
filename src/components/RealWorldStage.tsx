import React from 'react';
import { SkitScene } from '../data/sounds.ts';
import { User, Sparkles, Volume2, Film } from 'lucide-react';

interface RealWorldStageProps {
  scene: SkitScene;
  activeDialogue?: {
    speaker: string;
    text: string;
    pidginOrEnglish: string;
    mood: string;
  } | null;
  activeSoundCue?: string | null;
  isPlaying: boolean;
  characters: { name: string; role: string; raceOrStyle: string; color: string }[];
  raceSetting?: string;
}

export const RealWorldStage: React.FC<RealWorldStageProps> = ({
  scene,
  activeDialogue,
  activeSoundCue,
  isPlaying,
  characters,
  raceSetting = 'African (Nigerian)',
}) => {
  const char1 = characters[0] || { name: 'Actor 1', role: 'Lead', color: '#f59e0b', raceOrStyle: raceSetting };
  const char2 = characters[1] || { name: 'Actor 2', role: 'Support', color: '#10b981', raceOrStyle: raceSetting };

  const isChar1Speaking = !!(
    activeDialogue?.speaker &&
    char1?.name &&
    activeDialogue.speaker.toLowerCase().includes(char1.name.toLowerCase())
  );
  const isChar2Speaking = !!(
    activeDialogue?.speaker &&
    char2?.name &&
    activeDialogue.speaker.toLowerCase().includes(char2.name.toLowerCase())
  );

  // Dynamic camera transform classes
  const cameraClass =
    scene?.cameraAngle === 'close_up'
      ? 'scale-105'
      : scene?.cameraAngle === 'dramatic_zoom'
      ? isPlaying
        ? 'scale-110 duration-1000'
        : 'scale-100'
      : 'scale-100';

  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between p-4 sm:p-6 select-none transition-all">
      {/* Background Cinematic Texture & Gradient */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out ${cameraClass}`}
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)`,
        }}
      >
        {/* Ambient Film Grain and Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/80 pointer-events-none" />
      </div>

      {/* Top Header Information & Camera Indicator */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
            <Film className="w-3 h-3 text-amber-400" />
            {(scene?.cameraAngle || 'two_shot').replace('_', ' ')}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-[10px] font-semibold text-amber-300">
            Real World ({raceSetting})
          </span>
        </div>

        {/* Setting Badge */}
        <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 text-xs text-slate-300 border border-slate-800">
          <Sparkles className="w-3 h-3 text-teal-400" />
          <span className="truncate max-w-[200px]">{scene?.backgroundSetting || 'Living Room'}</span>
        </div>
      </div>

      {/* Center Stage: Real-World Character Visual Cards */}
      <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-8 items-center max-w-lg mx-auto w-full my-auto">
        {/* Character 1 Card */}
        <div
          className={`flex flex-col items-center p-3 sm:p-4 rounded-2xl transition-all duration-300 ${
            isChar1Speaking
              ? 'bg-gradient-to-b from-amber-500/20 to-slate-900/90 border-2 border-amber-500 shadow-xl shadow-amber-500/20 scale-105'
              : 'bg-slate-900/70 border border-slate-800 opacity-85'
          }`}
        >
          <div className="relative mb-2">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg transition-transform ${
                isChar1Speaking ? 'animate-bounce' : ''
              }`}
              style={{ backgroundColor: `${char1.color}25`, border: `2px solid ${char1.color}` }}
            >
              <User className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: char1.color }} />
            </div>
            {isChar1Speaking && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 items-center justify-center text-[8px] font-black text-slate-950">
                  🎙
                </span>
              </span>
            )}
          </div>
          <h4 className="text-sm sm:text-base font-bold text-white text-center truncate max-w-[120px]">
            {char1.name}
          </h4>
          <p className="text-[10px] text-amber-300/80 uppercase font-medium">{char1.role}</p>
        </div>

        {/* Character 2 Card */}
        <div
          className={`flex flex-col items-center p-3 sm:p-4 rounded-2xl transition-all duration-300 ${
            isChar2Speaking
              ? 'bg-gradient-to-b from-emerald-500/20 to-slate-900/90 border-2 border-emerald-500 shadow-xl shadow-emerald-500/20 scale-105'
              : 'bg-slate-900/70 border border-slate-800 opacity-85'
          }`}
        >
          <div className="relative mb-2">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg transition-transform ${
                isChar2Speaking ? 'animate-bounce' : ''
              }`}
              style={{ backgroundColor: `${char2.color}25`, border: `2px solid ${char2.color}` }}
            >
              <User className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: char2.color }} />
            </div>
            {isChar2Speaking && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 items-center justify-center text-[8px] font-black text-slate-950">
                  🎙
                </span>
              </span>
            )}
          </div>
          <h4 className="text-sm sm:text-base font-bold text-white text-center truncate max-w-[120px]">
            {char2.name}
          </h4>
          <p className="text-[10px] text-emerald-300/80 uppercase font-medium">{char2.role}</p>
        </div>
      </div>

      {/* Active Sound Effect Trigger Alert Banner */}
      {activeSoundCue && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-950/90 border-2 border-emerald-400 text-emerald-300 text-xs sm:text-sm font-black shadow-2xl animate-pulse">
          <Volume2 className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>[SFX CUE: {activeSoundCue.replace('sfx-', '').replace(/-/g, ' ').toUpperCase()}]</span>
        </div>
      )}

      {/* Visual Direction Prompt Footer */}
      <div className="relative z-10 w-full bg-slate-950/70 backdrop-blur-md rounded-xl p-2.5 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
        <span className="truncate text-slate-400 italic">
          🎬 {scene.visualDescription}
        </span>
        <span className="shrink-0 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono ml-2">
          Scene #{scene.sceneNumber}
        </span>
      </div>
    </div>
  );
};
