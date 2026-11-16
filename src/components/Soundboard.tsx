import React, { useState } from 'react';
import { SOUND_LIBRARY, SoundEffect } from '../data/sounds.ts';
import { soundSynthesizer } from '../utils/audioSynthesizer.ts';
import { Volume2, Play, Sparkles, Music, Smile, Film, Check } from 'lucide-react';

interface SoundboardProps {
  onSelectCue?: (soundId: string) => void;
  compact?: boolean;
}

export const Soundboard: React.FC<SoundboardProps> = ({ onSelectCue, compact = false }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'nigerian' | 'afrobeat' | 'comedy' | 'cinematic'>('all');
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [copiedSound, setCopiedSound] = useState<string | null>(null);

  const filteredSounds =
    activeCategory === 'all'
      ? SOUND_LIBRARY
      : SOUND_LIBRARY.filter((s) => s.category === activeCategory);

  const handlePlaySound = (sound: SoundEffect) => {
    setActivePlayingId(sound.id);
    soundSynthesizer.playSound(sound.synthType, 0.9);

    if (onSelectCue) {
      onSelectCue(sound.id);
      setCopiedSound(sound.id);
      setTimeout(() => setCopiedSound(null), 1500);
    }

    setTimeout(() => {
      setActivePlayingId((curr) => (curr === sound.id ? null : curr));
    }, sound.duration * 1000);
  };

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
      {/* Soundboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Volume2 className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">Naija Comedy Soundboard</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tap any pad to preview authentic Nollywood suspense stingers, slaps, and Afrobeat beats.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All', icon: Sparkles },
            { id: 'nigerian', label: '🇳🇬 Nollywood', icon: Film },
            { id: 'afrobeat', label: '🥁 Afrobeat', icon: Music },
            { id: 'comedy', label: '😂 Comedy', icon: Smile },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sound Pads Grid */}
      <div
        className={`grid gap-2.5 sm:gap-3 ${
          compact
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {filteredSounds.map((sound) => {
          const isPlaying = activePlayingId === sound.id;
          const isSelected = copiedSound === sound.id;

          return (
            <button
              key={sound.id}
              onClick={() => handlePlaySound(sound)}
              className={`relative flex flex-col items-start p-3 sm:p-3.5 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer group ${
                isPlaying
                  ? 'bg-gradient-to-br from-emerald-500/25 to-teal-900/40 border-emerald-400 shadow-lg shadow-emerald-500/30 -translate-y-0.5'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {/* Top Row: Icon + Duration Tag */}
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                  {sound.icon}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-slate-900/80 text-slate-400 border border-slate-700/50">
                  {sound.duration}s
                </span>
              </div>

              {/* Title & Tag */}
              <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                {sound.name}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{sound.tag}</p>

              {/* Action indicator at bottom */}
              <div className="flex items-center justify-between w-full mt-2.5 pt-2 border-t border-slate-700/40 text-[10px]">
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  {isPlaying ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Playing...
                    </>
                  ) : isSelected ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      Assigned!
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-emerald-400" />
                      {onSelectCue ? 'Pick Cue' : 'Tap to Play'}
                    </>
                  )}
                </span>
                <span className="text-slate-500 capitalize">{sound.category}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
