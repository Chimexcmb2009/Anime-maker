import React, { useState, useEffect } from 'react';
import { GeneratedSkit } from '../data/sounds.ts';
import { Soundboard } from './Soundboard.tsx';
import {
  Wand2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Film,
  Users,
  Volume2,
  Check,
  RotateCcw,
  Sliders,
  Play,
  Flame,
  Globe,
  Radio,
} from 'lucide-react';

interface SkitCreatorProps {
  onSkitGenerated: (skit: GeneratedSkit) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

export const SkitCreator: React.FC<SkitCreatorProps> = ({
  onSkitGenerated,
  isLoading,
  setIsLoading,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('comedic_drama');
  const [language, setLanguage] = useState('mixed');
  const [style, setStyle] = useState<'stickman' | 'realworld'>('stickman');
  const [raceOrEthnicity, setRaceOrEthnicity] = useState('African (Nigerian - Yoruba/Igbo/Hausa)');
  const [setting, setSetting] = useState('Lagos Living Room with lace sofa covers');
  const [audioMode, setAudioMode] = useState<'both' | 'audio_only' | 'subtitles_only'>('both');
  const [soundPack, setSoundPack] = useState('all_mix');

  // Templates
  interface SkitTemplate {
    id: string;
    title: string;
    logline: string;
    category: string;
    style: string;
    raceOrEthnicity?: string;
    audioMode: string;
    soundPack: string;
    prompt: string;
  }
  const [templates, setTemplates] = useState<SkitTemplate[]>([]);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [loadingStatusText, setLoadingStatusText] = useState('Consulting the comedic director...');

  // Fetch templates on mount
  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        if (data.templates) setTemplates(data.templates);
      })
      .catch(() => {});
  }, []);

  // Loading text rotation
  useEffect(() => {
    if (!isLoading) return;
    const tips = [
      'Brewing fresh Nigerian humor & punchlines...',
      'Synchronizing the mother’s slippers velocity...',
      'Summoning the Nollywood suspense violin...',
      'Tuning Lagos Danfo conductor whistle...',
      'Assembling the village people committee...',
      'Polishing Pidgin subtitles and comedic timing...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % tips.length;
      setLoadingStatusText(tips[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Enhance prompt with AI
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancingPrompt(true);
    try {
      const res = await fetch('/api/skits/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.warn('Enhance failed:', e);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Load a template
  const applyTemplate = (tpl: SkitTemplate) => {
    setPrompt(tpl.prompt);
    setStyle(tpl.style as 'stickman' | 'realworld');
    if (tpl.raceOrEthnicity) setRaceOrEthnicity(tpl.raceOrEthnicity);
    setAudioMode(tpl.audioMode as 'both' | 'audio_only' | 'subtitles_only');
    setSoundPack(tpl.soundPack);
  };

  // Generate Skit Request
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/skits/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style,
          raceOrEthnicity,
          audioMode,
          soundPack,
          tone,
          language,
          setting,
        }),
      });

      const data = await res.json();
      if (data.skit) {
        onSkitGenerated(data.skit);
      }
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Progress Stepper Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl backdrop-blur-md">
        {[
          { num: 1, label: 'Storyline & Prompt' },
          { num: 2, label: 'Style & Cast' },
          { num: 3, label: 'Audio & Sounds' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num as typeof step)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              step === s.num
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : step > s.num
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === s.num
                  ? 'bg-slate-950 text-white'
                  : step > s.num
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: Storyline & Premise Input */}
      {step === 1 && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Flame className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Step 1: What is your skit about?
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Describe the funny conflict, characters, or situation. You can write in English or Pidgin!
            </p>
          </div>

          {/* Quick Preset Templates Row */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Popular Skit Templates (1-Tap Load)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => applyTemplate(tpl)}
                  className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition active:scale-98 cursor-pointer group"
                >
                  <span className="text-lg">🎬</span>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {tpl.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {tpl.logline}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Textarea */}
          <div className="relative">
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Mama Chinedu rushes into the room holding a broomstick because she found an empty Indomie carton in the dustbin and swears it was eaten by spiritual forces..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none transition"
            />
            {/* AI Spice Enhancer Button */}
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={handleEnhancePrompt}
                disabled={!prompt.trim() || isEnhancingPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold shadow-sm hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isEnhancingPrompt ? 'Spicing with Naija Flavour...' : 'Spice Up with AI (Naija Flavor)'}</span>
              </button>

              <span className="text-[11px] text-slate-500 font-mono">
                {prompt.length} chars
              </span>
            </div>
          </div>

          {/* Tone & Language Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            {/* Tone Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Comedy Tone / Vibe
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="comedic_drama">Naija Comedic Drama (Expressive)</option>
                <option value="slapstick">Slapstick / Fast Physical Comedy</option>
                <option value="village_mystery">Village People & Nollywood Mystery</option>
                <option value="lagos_hustle">Lagos Street & Danfo Hustle</option>
                <option value="satire">Relatable Family Satire</option>
              </select>
            </div>

            {/* Language Dialect */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Dialect / Dialogue Mix
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="mixed">Mixed (Naija Pidgin + English)</option>
                <option value="naija_pidgin">Heavy Naija Pidgin (Street Authentic)</option>
                <option value="afro_english">African English Accent</option>
                <option value="standard_english">Standard English (with Naija Slang)</option>
              </select>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => setStep(2)}
            disabled={!prompt.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer mt-2"
          >
            <span>Next: Style & Character Casting</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Style Selector (Stick Man World vs. Real World) */}
      {step === 2 && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                <Users className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Step 2: Choose Skit Animation Style
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select between minimal comic Stick Man animation or cinematic Real World video generation.
            </p>
          </div>

          {/* Style Radio Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Stick Man World */}
            <div
              onClick={() => setStyle('stickman')}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                style === 'stickman'
                  ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/15'
                  : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🏃</span>
                  {style === 'stickman' && (
                    <span className="p-1 rounded-full bg-amber-500 text-slate-950">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white">Stick Man World</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Minimalist art style (simple ball head, stick body). Fast rendering, highly expressive slapstick gestures, flying slippers, and cartoon physics.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  ⚡ Instant Render
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                  Comedy King
                </span>
              </div>
            </div>

            {/* 2. Real World */}
            <div
              onClick={() => setStyle('realworld')}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                style === 'realworld'
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/15'
                  : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🎬</span>
                  {style === 'realworld' && (
                    <span className="p-1 rounded-full bg-emerald-500 text-slate-950">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white">Real World (Cinematic)</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Live-action and photorealistic scenes. Full race and ethnicity controls with cinematic camera cuts and detailed environments.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  🎭 Live-Action
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                  Nollywood 4K
                </span>
              </div>
            </div>
          </div>

          {/* Conditional Options for Real World: Ethnicity & Races */}
          {style === 'realworld' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 animate-in fade-in">
              <label className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Actor Races & Ethnicities
              </label>
              <select
                value={raceOrEthnicity}
                onChange={(e) => setRaceOrEthnicity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="African (Nigerian - Yoruba/Igbo/Hausa)">
                  African (Nigerian - Yoruba, Igbo, Hausa)
                </option>
                <option value="Black / African Diaspora">Black / African Diaspora</option>
                <option value="Caucasian / European">Caucasian / European</option>
                <option value="East Asian (Korean / Japanese / Chinese)">
                  East Asian (Korean / Japanese / Chinese)
                </option>
                <option value="South Asian (Indian / Pakistani)">South Asian (Indian / Pakistani)</option>
                <option value="Hispanic / Latino">Hispanic / Latino</option>
                <option value="Middle Eastern">Middle Eastern</option>
                <option value="Mixed / Diverse Ensemble">Mixed / Diverse Ensemble</option>
              </select>

              {/* Setting Selection */}
              <label className="text-xs font-semibold text-slate-300 mt-2 block">
                Visual Setting / Environment
              </label>
              <select
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Lagos Living Room with lace sofa covers and family portraits">
                  Lagos Living Room (Classic Parlor with Lace & Vintage Clock)
                </option>
                <option value="Yellow Danfo Bus in bustling Oshodi / CMS traffic">
                  Lagos Street / Yellow Danfo Bus Stop
                </option>
                <option value="Modern Tech Office / Startup Workspace">
                  Modern Tech Office (Laptops & Glass Walls)
                </option>
                <option value="African Village Compound with mud walls and palm trees">
                  Village Compound with Palm Trees & Calabash
                </option>
                <option value="Local Nigerian Open Market with colorful umbrellas">
                  Open Air Street Market with Food Stalls
                </option>
              </select>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <span>Next: Audio & Sound FX</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Audio, Subtitle & Nigerian Sound Pack Selector */}
      {step === 3 && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                <Volume2 className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Step 3: Audio, Subtitles & Nigerian Sound FX
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select your audio output mode and pick an authentic sound pack.
            </p>
          </div>

          {/* Audio & Subtitle Options Toggle */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Audio & Subtitle Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'both',
                  title: 'Both (Full Audio)',
                  desc: 'Speech voice + sound effects + subtitles',
                  badge: 'Recommended',
                },
                {
                  id: 'audio_only',
                  title: 'Audio FX Only',
                  desc: 'Speech synthesis and sound effects only',
                },
                {
                  id: 'subtitles_only',
                  title: 'Subtitles Only',
                  desc: 'Mute / Silent movie with stylized subtitles',
                },
              ].map((mode) => (
                <div
                  key={mode.id}
                  onClick={() => setAudioMode(mode.id as typeof audioMode)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    audioMode === mode.id
                      ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-xs font-bold text-white">{mode.title}</h5>
                      {audioMode === mode.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">{mode.desc}</p>
                  </div>
                  {mode.badge && (
                    <span className="mt-2 text-[9px] font-bold text-emerald-400 self-start">
                      ⭐ {mode.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Nigerian Sound Pack Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Dedicated Nigerian Sound Library Pack
            </label>
            <select
              value={soundPack}
              onChange={(e) => setSoundPack(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all_mix">All-Stars Mix (Nollywood + Slap + Danfo + Memes)</option>
              <option value="nollywood_suspense">
                Iconic Nollywood Drama & Suspense (Tritone Organ + Village Flute)
              </option>
              <option value="street_comedy">
                Lagos Danfo & Street Comedy (Whistles + Agbero Shouts + Laugh Track)
              </option>
              <option value="african_parents">
                African Parents & Discipline (Loud Slap + Chai Exclamations + Record Scratch)
              </option>
              <option value="amapiano_bounce">
                Amapiano & Afrobeat Grooves (Log Drum + Syncopated Beats)
              </option>
            </select>
          </div>

          {/* Interactive Soundboard Preview Drawer */}
          <div className="border border-slate-800 rounded-2xl p-3 bg-slate-950/60">
            <p className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <span>🔊 Preview Soundboard Cues</span>
              <span className="text-[10px] text-slate-500 font-normal">(Tap to test before generating)</span>
            </p>
            <Soundboard compact={true} />
          </div>

          {/* Navigation & Submit Generate */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Generate Skit Scene (Gemini AI)</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-center flex flex-col items-center">
            {/* Animated film clapper and spinner */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl animate-bounce">
                🎬
              </div>
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 items-center justify-center text-[10px]">
                  ✨
                </span>
              </span>
            </div>

            <h3 className="text-lg font-black text-white">Directing Skit Scene...</h3>
            <p className="text-xs text-emerald-400 font-medium mt-2 animate-pulse min-h-[36px] flex items-center justify-center">
              {loadingStatusText}
            </p>

            <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full w-3/4 animate-pulse" />
            </div>

            <p className="text-[10px] text-slate-500 mt-4">
              Generating dialogue lines, stickman gestures, and sound cue timestamps with Google Gemini 3.8 Flash.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
