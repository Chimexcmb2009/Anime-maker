import React, { useState, useEffect, useRef } from 'react';
import { GeneratedSkit, SOUND_LIBRARY } from '../data/sounds.ts';
import { StickmanStage } from './StickmanStage.tsx';
import { RealWorldStage } from './RealWorldStage.tsx';
import { Soundboard } from './Soundboard.tsx';
import { soundSynthesizer, speakDialogue, stopAllSpeech } from '../utils/audioSynthesizer.ts';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Subtitles,
  Download,
  Share2,
  Layers,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SkitPlayerProps {
  skit: GeneratedSkit;
  onEditSkit?: () => void;
}

export const SkitPlayer: React.FC<SkitPlayerProps> = ({ skit }) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [currentTimeInScene, setCurrentTimeInScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [activeStyle, setActiveStyle] = useState<'stickman' | 'realworld'>(skit.style);
  const [isMuted, setIsMuted] = useState(skit.audioMode === 'subtitles_only');
  const [showSoundboardOverlay, setShowSoundboardOverlay] = useState(false);
  const [activeSoundCue, setActiveSoundCue] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const playedSfxInScene = useRef<Set<string>>(new Set());
  const spokenDialogueInScene = useRef<Set<number>>(new Set());

  const currentScene = skit.scenes[currentSceneIdx] || skit.scenes[0];
  const sceneDuration = currentScene?.sceneDurationSeconds || 7;

  // Active dialogue line based on currentTimeInScene
  const activeDialogueIdx = currentScene?.dialogueLines
    ? currentScene.dialogueLines.findIndex((line) => {
        const start = line?.startOffset ?? 0;
        const dur = line?.duration ?? 2.5;
        const end = start + dur;
        return currentTimeInScene >= start && currentTimeInScene <= end;
      })
    : -1;

  const activeDialogue =
    activeDialogueIdx !== -1 && currentScene?.dialogueLines
      ? currentScene.dialogueLines[activeDialogueIdx]
      : null;

  // Master timeline ticker
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 100;
    timerRef.current = setInterval(() => {
      setCurrentTimeInScene((prev) => {
        const nextTime = prev + (intervalMs / 1000) * playbackSpeed;

        // Check for Sound Effects triggers at current timestamp
        if (!isMuted && currentScene?.soundEffects) {
          currentScene.soundEffects.forEach((sfx) => {
            const cueKey = `${currentSceneIdx}-${sfx.soundId}-${sfx.timingSeconds}`;
            if (
              !playedSfxInScene.current.has(cueKey) &&
              nextTime >= sfx.timingSeconds &&
              nextTime < sfx.timingSeconds + 0.4
            ) {
              playedSfxInScene.current.add(cueKey);
              const foundSound = SOUND_LIBRARY.find((s) => s.id === sfx.soundId);
              if (foundSound) {
                soundSynthesizer.playSound(foundSound.synthType, sfx.volume);
                setActiveSoundCue(sfx.soundId);
                setTimeout(() => setActiveSoundCue(null), 1800);
              }
            }
          });
        }

        // Check for Dialogue Speech triggers at current timestamp
        if (!isMuted && skit.audioMode !== 'subtitles_only' && currentScene?.dialogueLines) {
          currentScene.dialogueLines.forEach((diag, idx) => {
            const diagKey = `${currentSceneIdx}-${idx}`;
            if (
              !spokenDialogueInScene.current.has(idx) &&
              nextTime >= diag.startOffset &&
              nextTime < diag.startOffset + 0.35
            ) {
              spokenDialogueInScene.current.add(idx);
              const char = skit.characters.find((c) =>
                diag.speaker.toLowerCase().includes(c.name.toLowerCase())
              );
              speakDialogue(diag.pidginOrEnglish || diag.text, {
                pitch: char?.voicePitch || 1.0,
                rate: playbackSpeed,
              });
            }
          });
        }

        // Scene transition check
        if (nextTime >= sceneDuration) {
          if (currentSceneIdx < skit.scenes.length - 1) {
            // Next scene
            playedSfxInScene.current.clear();
            spokenDialogueInScene.current.clear();
            setCurrentSceneIdx((curr) => curr + 1);
            return 0;
          } else {
            // Skit finished!
            setIsPlaying(false);
            stopAllSpeech();
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 },
            });
            return sceneDuration;
          }
        }

        return nextTime;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    isPlaying,
    playbackSpeed,
    currentSceneIdx,
    currentScene,
    sceneDuration,
    isMuted,
    skit.audioMode,
    skit.scenes.length,
    skit.characters,
  ]);

  const handlePlayPause = () => {
    if (currentTimeInScene >= sceneDuration && currentSceneIdx === skit.scenes.length - 1) {
      handleRestart();
    } else {
      setIsPlaying(!isPlaying);
      if (isPlaying) {
        stopAllSpeech();
      }
    }
  };

  const handleRestart = () => {
    stopAllSpeech();
    setIsPlaying(false);
    playedSfxInScene.current.clear();
    spokenDialogueInScene.current.clear();
    setCurrentSceneIdx(0);
    setCurrentTimeInScene(0);
    setTimeout(() => setIsPlaying(true), 150);
  };

  const handleSelectScene = (index: number) => {
    stopAllSpeech();
    playedSfxInScene.current.clear();
    spokenDialogueInScene.current.clear();
    setCurrentSceneIdx(index);
    setCurrentTimeInScene(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTimeInScene(newTime);
  };

  const copyScriptText = () => {
    const text = `=== ${skit.title} ===\n${skit.logline}\nStyle: ${skit.style} | Sound Pack: ${skit.soundPack}\n\n` +
      skit.scenes
        .map(
          (sc) =>
            `SCENE ${sc.sceneNumber}: ${sc.title}\nSetting: ${sc.backgroundSetting}\n` +
            sc.dialogueLines.map((d) => `  ${d.speaker}: "${d.pidginOrEnglish}" [${d.mood}]`).join('\n') +
            `\n  Sound FX: ` +
            sc.soundEffects.map((s) => `${s.name} at ${s.timingSeconds}s`).join(', ')
        )
        .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const downloadSkitJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(skit, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${skit.title.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Bar: Title & Style Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
              {skit.style === 'stickman' ? 'Stickman World' : 'Real World Skit'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Total {skit.totalDurationSeconds}s
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1 line-clamp-1">{skit.title}</h2>
          <p className="text-xs text-slate-400 line-clamp-1">{skit.logline}</p>
        </div>

        {/* Style View Toggle & Export */}
        <div className="flex items-center gap-2">
          {/* Style Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveStyle('stickman')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStyle === 'stickman'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Stick Man
            </button>
            <button
              onClick={() => setActiveStyle('realworld')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStyle === 'realworld'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Real World
            </button>
          </div>

          {/* Export / Share Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title="Download or Export Skit"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Animated Stage Area */}
      <div className="relative w-full">
        {activeStyle === 'stickman' ? (
          <StickmanStage
            scene={currentScene}
            activeDialogue={activeDialogue}
            activeSoundCue={activeSoundCue}
            isPlaying={isPlaying}
            characters={skit.characters}
          />
        ) : (
          <RealWorldStage
            scene={currentScene}
            activeDialogue={activeDialogue}
            activeSoundCue={activeSoundCue}
            isPlaying={isPlaying}
            characters={skit.characters}
            raceSetting={skit.raceSetting}
          />
        )}
      </div>

      {/* Subtitles & Dialogue Karaoke Bar */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col justify-center min-h-[72px]">
        {activeDialogue ? (
          <div className="flex items-start gap-3 animate-in fade-in">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0 flex items-center gap-1">
              <Subtitles className="w-3.5 h-3.5" />
              <span>{activeDialogue.speaker}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-bold text-white leading-snug">
                "{activeDialogue.pidginOrEnglish}"
              </p>
              {activeDialogue.text !== activeDialogue.pidginOrEnglish && (
                <p className="text-xs text-slate-400 mt-0.5 italic">
                  EN: {activeDialogue.text}
                </p>
              )}
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
              {activeDialogue.mood}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="italic flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-slate-600" />
              {currentScene?.title || 'Waiting for action...'}
            </span>
            <span className="text-[10px] text-slate-600">
              BGM: {currentScene?.bgmTrack?.vibe || 'Afro Comedy Groove'} ({currentScene?.bgmTrack?.bpm || 110} BPM)
            </span>
          </div>
        )}
      </div>

      {/* Playback Controls & Timeline Scrubber */}
      <div className="w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col gap-3">
        {/* Timeline Scrub Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>
              Scene {currentSceneIdx + 1} of {skit?.scenes?.length || 1}: {currentScene?.title || ''}
            </span>
            <span>
              {currentTimeInScene.toFixed(1)}s / {sceneDuration.toFixed(1)}s
            </span>
          </div>

          <input
            type="range"
            min="0"
            max={sceneDuration}
            step="0.1"
            value={currentTimeInScene}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition"
          />

          {/* Sound Effect Markers on Timeline */}
          <div className="relative w-full h-3">
            {(currentScene?.soundEffects || []).map((sfx, idx) => {
              const posPercent = (sfx.timingSeconds / sceneDuration) * 100;
              return (
                <div
                  key={idx}
                  style={{ left: `${Math.min(95, posPercent)}%` }}
                  className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center group cursor-pointer"
                  onClick={() => {
                    const sound = SOUND_LIBRARY.find((s) => s.id === sfx.soundId);
                    if (sound) soundSynthesizer.playSound(sound.synthType);
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950 animate-pulse" />
                  <span className="hidden group-hover:block absolute bottom-3 z-30 whitespace-nowrap bg-slate-950 text-amber-300 text-[9px] px-1.5 py-0.5 rounded border border-amber-500/40 font-mono shadow-lg">
                    {sfx.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Master Control Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          {/* Left: Scene Switchers */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSelectScene(Math.max(0, currentSceneIdx - 1))}
              disabled={currentSceneIdx === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 disabled:cursor-not-allowed cursor-pointer transition"
              title="Previous Scene"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleRestart()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Large Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause Skit' : 'Play Skit'}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950 ml-0.5" />}
          </button>

          {/* Right: Audio Toggle & Speed & Soundboard Drawer */}
          <div className="flex items-center gap-1.5">
            {/* Next Scene Button */}
            <button
              onClick={() => handleSelectScene(Math.min(skit.scenes.length - 1, currentSceneIdx + 1))}
              disabled={currentSceneIdx === skit.scenes.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 disabled:cursor-not-allowed cursor-pointer transition"
              title="Next Scene"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Mute Audio Toggle */}
            <button
              onClick={() => {
                if (!isMuted) stopAllSpeech();
                setIsMuted(!isMuted);
              }}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Playback Speed */}
            <button
              onClick={() => {
                const nextSpeed = playbackSpeed === 1.0 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1.0;
                setPlaybackSpeed(nextSpeed);
              }}
              className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold cursor-pointer"
              title="Change Speed"
            >
              {playbackSpeed}x
            </button>

            {/* Live Soundboard Overlay Toggle */}
            <button
              onClick={() => setShowSoundboardOverlay(!showSoundboardOverlay)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                showSoundboardOverlay
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
              }`}
            >
              <span>SFX</span>
              {showSoundboardOverlay ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Scene Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none">
          {skit.scenes.map((sc, idx) => (
            <button
              key={sc.sceneNumber}
              onClick={() => handleSelectScene(idx)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                currentSceneIdx === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center text-[10px]">
                {idx + 1}
              </span>
              <span>{sc.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Soundboard Drawer (Toggable during playback!) */}
      {showSoundboardOverlay && (
        <div className="w-full animate-in slide-in-from-top-4 duration-200">
          <Soundboard
            compact={true}
            onSelectCue={(soundId) => {
              setActiveSoundCue(soundId);
              setTimeout(() => setActiveSoundCue(null), 1800);
            }}
          />
        </div>
      )}

      {/* Export & Download Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Download className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-bold text-white">Export Skit Package</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 my-4 leading-relaxed">
              Export your skit package including full script lines, scene timestamps, sound effect triggers, and character casting.
            </p>

            <div className="space-y-3">
              <button
                onClick={downloadSkitJson}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-white font-bold">Download Skit Project (.JSON)</p>
                    <p className="text-xs text-slate-400">Complete animation and audio timeline file</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={copyScriptText}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-amber-400" />
                  <div className="text-left">
                    <p className="text-white font-bold">Copy Screenplay to Clipboard</p>
                    <p className="text-xs text-slate-400">Formatted lines with Pidgin subtitles</p>
                  </div>
                </div>
                {copiedStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs text-slate-400">Copy</span>}
              </button>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
