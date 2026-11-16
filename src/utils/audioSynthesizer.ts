/**
 * High-Fidelity Web Audio Synthesizer for Nigerian Skit & Comedy Sound FX
 * Works completely offline with zero latency and high precision.
 */

class AudioSynthesizerEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Master play entry point
  playSound(synthType: string, volume: number = 0.8): void {
    try {
      const ctx = this.getContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.max(0.1, Math.min(1.0, volume)), ctx.currentTime);
      masterGain.connect(ctx.destination);

      switch (synthType) {
        case 'nollywood_suspense':
          this.playNollywoodSuspense(ctx, masterGain);
          break;
        case 'slap_impact':
          this.playSlapImpact(ctx, masterGain);
          break;
        case 'chai_shout':
          this.playChaiShout(ctx, masterGain);
          break;
        case 'e_shock_you':
          this.playEShockYou(ctx, masterGain);
          break;
        case 'village_people_flute':
          this.playVillagePeopleFlute(ctx, masterGain);
          break;
        case 'danfo_whistle':
          this.playDanfoWhistle(ctx, masterGain);
          break;
        case 'church_organ':
          this.playChurchOrgan(ctx, masterGain);
          break;
        case 'log_drum':
          this.playLogDrum(ctx, masterGain);
          break;
        case 'afro_groove_loop':
          this.playAfroGroove(ctx, masterGain);
          break;
        case 'record_scratch':
          this.playRecordScratch(ctx, masterGain);
          break;
        case 'laugh_track':
          this.playLaughTrack(ctx, masterGain);
          break;
        case 'cartoon_boing':
          this.playCartoonBoing(ctx, masterGain);
          break;
        case 'rimshot_comedy':
          this.playRimshot(ctx, masterGain);
          break;
        case 'awkward_crickets':
          this.playAwkwardCrickets(ctx, masterGain);
          break;
        case 'dramatic_thud':
          this.playDramaticThud(ctx, masterGain);
          break;
        case 'cheer_applause':
          this.playCheerApplause(ctx, masterGain);
          break;
        default:
          this.playRimshot(ctx, masterGain);
      }
    } catch (e) {
      console.warn('Audio synthesis playback error:', e);
    }
  }

  // 1. Iconic Nollywood Suspense (Tritone suspense + sudden dramatic brass hit)
  private playNollywoodSuspense(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;

    // Dark minor 2nd clash: E4 (329.63Hz) and F4 (349.23Hz)
    const notes = [164.81, 246.94, 329.63, 349.23, 698.46];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      // Vibrato / tension
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(4.5 + idx * 0.5, t);
      lfoGain.gain.setValueAtTime(6, t);
      lfo.connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + 3.2);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.3);
      gain.gain.setValueAtTime(0.18, t + 1.8);
      // Sudden dramatic swell then cutoff
      gain.gain.linearRampToValueAtTime(0.35, t + 2.5);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 3.2);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 3.2);
    });

    // Dramatic sub-hit at 2.4s (Climax of suspense)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, t + 2.4);
    subOsc.frequency.exponentialRampToValueAtTime(35, t + 3.2);
    subGain.gain.setValueAtTime(0, t);
    subGain.gain.setValueAtTime(0.4, t + 2.4);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 3.2);
    subOsc.connect(subGain);
    subGain.connect(dest);
    subOsc.start(t + 2.4);
    subOsc.stop(t + 3.2);
  }

  // 2. African Mother Slap (High impact crack + low punch + comical ringing)
  private playSlapImpact(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;

    // Noise crack
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1400, t);
    noiseFilter.Q.setValueAtTime(3.0, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dest);
    noise.start(t);

    // Punch body kick (thud)
    const kick = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kick.frequency.setValueAtTime(220, t);
    kick.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    kickGain.gain.setValueAtTime(0.9, t);
    kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    kick.connect(kickGain);
    kickGain.connect(dest);
    kick.start(t);
    kick.stop(t + 0.25);

    // Comedic ear ringing tone (aftermath of the slap)
    const ring = ctx.createOscillator();
    const ringGain = ctx.createGain();
    ring.type = 'sine';
    ring.frequency.setValueAtTime(2600, t + 0.1);
    ringGain.gain.setValueAtTime(0, t);
    ringGain.gain.setValueAtTime(0.18, t + 0.1);
    ringGain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
    ring.connect(ringGain);
    ringGain.connect(dest);
    ring.start(t + 0.1);
    ring.stop(t + 1.4);
  }

  // 3. Chai! / Ewoo! Vocal Shock (Synthetic pitch drop exclamation)
  private playChaiShout(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    // Pitch bends down expressing shock: "Chaaai!"
    osc1.frequency.setValueAtTime(650, t);
    osc1.frequency.exponentialRampToValueAtTime(220, t + 0.6);
    osc2.frequency.setValueAtTime(655, t);
    osc2.frequency.exponentialRampToValueAtTime(215, t + 0.6);

    // Formant vocal filter
    const formant = ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.frequency.setValueAtTime(950, t);
    formant.frequency.linearRampToValueAtTime(600, t + 0.6);
    formant.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc1.connect(formant);
    osc2.connect(formant);
    formant.connect(gain);
    gain.connect(dest);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.75);
    osc2.stop(t + 0.75);

    // Followed by dramatic comedy echo tap
    setTimeout(() => {
      this.playCartoonBoing(ctx, dest);
    }, 450);
  }

  // 4. "E Shock You!" Rising twist stinger
  private playEShockYou(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    // Rapid rise then sudden drop
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.35);
    osc.frequency.setValueAtTime(900, t + 0.4);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.85);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, t);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.95);
  }

  // 5. Village People Theme Flute (Pentatonic woodwind with mystery reverb)
  private playVillagePeopleFlute(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    // African pentatonic flute sequence
    const notes = [
      { freq: 440, start: 0, dur: 0.6 },
      { freq: 493.88, start: 0.55, dur: 0.5 },
      { freq: 554.37, start: 1.0, dur: 0.7 },
      { freq: 659.25, start: 1.65, dur: 0.8 },
      { freq: 554.37, start: 2.4, dur: 1.0 },
    ];

    notes.forEach((note) => {
      const startTime = t + note.start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, startTime);

      // Flute breath vibrato
      const vib = ctx.createOscillator();
      const vibGain = ctx.createGain();
      vib.frequency.setValueAtTime(5.5, startTime);
      vibGain.gain.setValueAtTime(8, startTime);
      vib.connect(osc.frequency);
      vib.start(startTime);
      vib.stop(startTime + note.dur);

      gain.gain.setValueAtTime(0.01, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(startTime);
      osc.stop(startTime + note.dur);
    });
  }

  // 6. Lagos Danfo Conductor Whistle (Two-tone piercing street whistle)
  private playDanfoWhistle(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    [0, 0.4, 0.8].forEach((offset) => {
      const st = t + offset;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(2600, st);
      osc2.frequency.setValueAtTime(2850, st);

      gain.gain.setValueAtTime(0.01, st);
      gain.gain.linearRampToValueAtTime(0.25, st + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(dest);

      osc1.start(st);
      osc2.start(st);
      osc1.stop(st + 0.3);
      osc2.stop(st + 0.3);
    });
  }

  // 7. Naija Church Organ Chord Crash
  private playChurchOrgan(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    // C Major 7 gospel organ chord with rich drawbars
    const chord = [261.63, 329.63, 392.0, 493.88, 523.25, 659.25];
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      // Tremolo
      const trem = ctx.createOscillator();
      const tremGain = ctx.createGain();
      trem.frequency.setValueAtTime(6.0, t);
      tremGain.gain.setValueAtTime(0.05, t);
      trem.connect(gain.gain);
      trem.start(t);
      trem.stop(t + 2.4);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.1);
      gain.gain.setValueAtTime(0.08, t + 1.8);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.4);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 2.4);
    });
  }

  // 8. Amapiano / Afrobeat Log Drum
  private playLogDrum(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    const hits = [0, 0.3, 0.7, 1.1];
    hits.forEach((offset, idx) => {
      const st = t + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch drop characteristic of log drum
      const startPitch = idx % 2 === 0 ? 190 : 160;
      osc.frequency.setValueAtTime(startPitch, st);
      osc.frequency.exponentialRampToValueAtTime(42, st + 0.28);

      gain.gain.setValueAtTime(0.9, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.32);

      // Mild distortion / saturation node
      const shaper = ctx.createWaveShaper();
      shaper.curve = this.makeDistortionCurve(20);

      osc.connect(shaper);
      shaper.connect(gain);
      gain.connect(dest);

      osc.start(st);
      osc.stop(st + 0.35);
    });
  }

  // 9. Afrobeat Comedy Groove Loop
  private playAfroGroove(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    // 4 beats with bounce
    for (let i = 0; i < 8; i++) {
      const beatTime = t + i * 0.3;
      // Kick on 0, 2, 4, 6
      if (i % 2 === 0) {
        const kick = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kick.frequency.setValueAtTime(140, beatTime);
        kick.frequency.exponentialRampToValueAtTime(40, beatTime + 0.15);
        kickGain.gain.setValueAtTime(0.6, beatTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.2);
        kick.connect(kickGain);
        kickGain.connect(dest);
        kick.start(beatTime);
        kick.stop(beatTime + 0.25);
      }

      // Shaker on all 8ths
      const shakerBuf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const data = shakerBuf.getChannelData(0);
      for (let s = 0; s < data.length; s++) data[s] = (Math.random() * 2 - 1) * 0.15;
      const shaker = ctx.createBufferSource();
      shaker.buffer = shakerBuf;
      const shakerFilter = ctx.createBiquadFilter();
      shakerFilter.type = 'highpass';
      shakerFilter.frequency.setValueAtTime(5000, beatTime);
      shaker.connect(shakerFilter);
      shakerFilter.connect(dest);
      shaker.start(beatTime);
    }
  }

  // 10. Record Scratch
  private playRecordScratch(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.35);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  // 11. Laugh Track
  private playLaughTrack(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    // 6 rapid laughter burst chuckles: "Ha-ha-ha-ha!"
    for (let i = 0; i < 6; i++) {
      const laughTime = t + i * 0.16;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(380 + (i % 2) * 50, laughTime);
      osc.frequency.exponentialRampToValueAtTime(260, laughTime + 0.12);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, laughTime);
      filter.Q.setValueAtTime(3.0, laughTime);

      gain.gain.setValueAtTime(0.3, laughTime);
      gain.gain.exponentialRampToValueAtTime(0.001, laughTime + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      osc.start(laughTime);
      osc.stop(laughTime + 0.15);
    }
  }

  // 12. Cartoon Boing
  private playCartoonBoing(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(680, t + 0.35);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.55);
  }

  // 13. Rimshot (Ba-Dum-Tss)
  private playRimshot(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    // Ba
    this.playSnareHit(ctx, dest, t, 180);
    // Dum
    this.playSnareHit(ctx, dest, t + 0.18, 140);
    // Tss (Cymbal crash)
    setTimeout(() => {
      this.playCymbalTss(ctx, dest);
    }, 360);
  }

  private playSnareHit(ctx: AudioContext, dest: AudioNode, time: number, freq: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.1);
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + 0.15);
  }

  private playCymbalTss(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.setValueAtTime(7000, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(t);
  }

  // 14. Awkward Crickets
  private playAwkwardCrickets(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const chirpTime = t + i * 0.25;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(4500, chirpTime);

      gain.gain.setValueAtTime(0.01, chirpTime);
      gain.gain.linearRampToValueAtTime(0.12, chirpTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, chirpTime + 0.12);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(chirpTime);
      osc.stop(chirpTime + 0.14);
    }
  }

  // 15. Dramatic Sub-Drop Thud
  private playDramaticThud(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, t);
    osc.frequency.exponentialRampToValueAtTime(24, t + 0.8);

    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.95);
  }

  // 16. Cheer Applause
  private playCheerApplause(ctx: AudioContext, dest: AudioNode): void {
    const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / data.length) * Math.PI);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.setValueAtTime(2200, t);
    f.Q.setValueAtTime(1.5, t);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 1.45);

    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(t);
  }

  private makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
    const k = amount;
    const n = 22050;
    const buffer = new ArrayBuffer(n * 4);
    const curve = new Float32Array(buffer);
    const deg = Math.PI / 180;
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
}

export const soundSynthesizer = new AudioSynthesizerEngine();

// Speech synthesis helper for speaking characters' lines with dynamic pitch and rate
export function speakDialogue(
  text: string,
  options?: {
    pitch?: number;
    rate?: number;
    lang?: string;
    onEnd?: () => void;
  }
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // clear previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.rate = options?.rate ?? 1.0;
    utterance.lang = options?.lang ?? 'en-GB';

    // Try finding an English or African accent if available
    const voices = (window.speechSynthesis.getVoices() || []);
    const preferredVoice = voices.find(
      (v) =>
        v?.lang?.startsWith('en-NG') ||
        v?.lang?.startsWith('en-ZA') ||
        v?.name?.toLowerCase().includes('nigeria') ||
        v?.lang?.startsWith('en-GB')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (options?.onEnd) {
      utterance.onend = options.onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis failed:', err);
    return false;
  }
}

export function stopAllSpeech(): void {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch (err) {
    console.warn('Stop speech failed:', err);
  }
}
