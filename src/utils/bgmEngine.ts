/**
 * Background Music (BGM) & Ambient Sound Engine
 * Supports:
 * 1. Web Audio API Melody & Chords Synthesizer (100% Offline, Zero external assets)
 * 2. HTML5 Audio for Custom Uploaded / Audio Tracks
 */

export type BgmTrackType = 'lofi' | 'cheerful' | 'acoustic' | 'synthwave' | 'custom';

export interface BgmTrackOption {
  id: BgmTrackType;
  title: string;
  genre: string;
  description: string;
  icon: string;
}

export const BGM_TRACKS: BgmTrackOption[] = [
  {
    id: 'lofi',
    title: 'Lo-Fi Chill Belajar',
    genre: 'Lo-Fi Chillout',
    description: 'Melodi lembut bertempo santai untuk meningkatkan konsentrasi dan relaksasi.',
    icon: '🎧'
  },
  {
    id: 'cheerful',
    title: 'Semangat Ceria & Inspiratif',
    genre: 'Upbeat Acoustic',
    description: 'Irama riang yang membangkitkan antusiasme belajar dan memecahkan tantangan.',
    icon: '✨'
  },
  {
    id: 'acoustic',
    title: 'Harmoni Tenang & Fokus',
    genre: 'Peaceful Piano Chords',
    description: 'Akord hangat bertempo lambat yang menenangkan pikiran saat membaca materi.',
    icon: '🍃'
  },
  {
    id: 'synthwave',
    title: 'Game Zone 8-Bit Arcade',
    genre: 'Chiptune Retro',
    description: 'Irama retro arcade yang seru dan memacu adrenalin saat menyelesaikan mini games.',
    icon: '🕹️'
  }
];

class BgmEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.35; // 0.0 to 1.0
  private currentTrack: BgmTrackType = 'lofi';
  private timerId: number | null = null;
  private customAudioEl: HTMLAudioElement | null = null;
  private customAudioUrl: string | null = null;
  private step: number = 0;
  private masterGain: GainNode | null = null;

  // Observers for state sync in React UI
  private listeners: Array<() => void> = [];

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private setupMasterGain(ctx: AudioContext) {
    if (!this.masterGain) {
      this.masterGain = ctx.createGain();
      this.masterGain.connect(ctx.destination);
    }
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, ctx.currentTime);
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      currentTrack: this.currentTrack,
      hasCustomAudio: !!this.customAudioUrl
    };
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.customAudioEl) {
      this.customAudioEl.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.customAudioEl) {
      this.customAudioEl.muted = this.isMuted;
    }
    this.notify();
    return this.isMuted;
  }

  public setTrack(track: BgmTrackType, customUrl?: string) {
    const wasPlaying = this.isPlaying;
    this.stop();
    this.currentTrack = track;
    if (customUrl) {
      this.customAudioUrl = customUrl;
    }
    if (wasPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public setCustomAudio(urlOrBase64: string) {
    this.customAudioUrl = urlOrBase64;
    this.setTrack('custom', urlOrBase64);
  }

  public play() {
    if (this.isPlaying) return;

    if (this.currentTrack === 'custom' && this.customAudioUrl) {
      this.playCustomAudio();
    } else {
      this.startSynthesizerLoop();
    }

    this.isPlaying = true;
    this.notify();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.customAudioEl) {
      this.customAudioEl.pause();
      this.customAudioEl.currentTime = 0;
    }
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  private playCustomAudio() {
    if (!this.customAudioUrl) return;
    if (!this.customAudioEl) {
      this.customAudioEl = new Audio();
      this.customAudioEl.loop = true;
    }
    this.customAudioEl.src = this.customAudioUrl;
    this.customAudioEl.volume = this.isMuted ? 0 : this.volume;
    this.customAudioEl.play().catch(() => {
      // Fallback to synth if audio file cannot be played
      this.startSynthesizerLoop();
    });
  }

  /**
   * Generates pleasing procedural Lo-Fi / Ambient Chords & Arpeggios using pure Web Audio API
   */
  private startSynthesizerLoop() {
    const ctx = this.getContext();
    if (!ctx) return;
    this.setupMasterGain(ctx);

    // Chords and melody patterns depending on track type
    // Lo-Fi: Cmaj7 (C4, E4, G4, B4) -> Am7 (A3, C4, E4, G4) -> Fmaj7 (F3, A3, C4, E4) -> G7 (G3, B3, D4, F4)
    const lofiChords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];

    // Cheerful Upbeat: G -> D -> Em -> C
    const cheerfulChords = [
      [196.00, 246.94, 293.66, 392.00], // G
      [146.83, 220.00, 293.66, 369.99], // D
      [164.81, 196.00, 246.94, 329.63], // Em
      [130.81, 164.81, 196.00, 261.63]  // C
    ];

    // Acoustic Peaceful: D -> F#m -> G -> A
    const acousticChords = [
      [146.83, 220.00, 293.66, 369.99], // D
      [185.00, 220.00, 277.18, 369.99], // F#m
      [196.00, 246.94, 293.66, 392.00], // G
      [220.00, 277.18, 329.63, 440.00]  // A
    ];

    // Synthwave / 8-bit: Am -> F -> C -> G
    const synthChords = [
      [220.00, 261.63, 329.63, 440.00], // Am
      [174.61, 220.00, 261.63, 349.23], // F
      [130.81, 164.81, 196.00, 261.63], // C
      [196.00, 246.94, 293.66, 392.00]  // G
    ];

    const getProgression = () => {
      switch (this.currentTrack) {
        case 'cheerful': return cheerfulChords;
        case 'acoustic': return acousticChords;
        case 'synthwave': return synthChords;
        case 'lofi':
        default: return lofiChords;
      }
    };

    this.step = 0;

    const playBeat = () => {
      if (!this.isPlaying) return;
      const actx = this.getContext();
      if (!actx || !this.masterGain) return;

      const prog = getProgression();
      const chordIdx = Math.floor(this.step / 4) % prog.length;
      const subStep = this.step % 4;
      const chord = prog[chordIdx];
      const now = actx.currentTime;

      try {
        // Play chord pad with soft envelope on first beat of bar
        if (subStep === 0) {
          chord.forEach((freq, i) => {
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            osc.type = this.currentTrack === 'synthwave' ? 'sawtooth' : 'sine';
            osc.frequency.setValueAtTime(freq * (this.currentTrack === 'synthwave' ? 0.5 : 1), now);

            const peak = 0.045 / (i + 1);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(peak, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(now);
            osc.stop(now + 2.4);
          });
        }

        // Arpeggio note on every sub-beat
        const noteFreq = chord[subStep % chord.length] * (this.currentTrack === 'synthwave' ? 2 : 1.5);
        const arpOsc = actx.createOscillator();
        const arpGain = actx.createGain();
        arpOsc.type = this.currentTrack === 'synthwave' ? 'square' : 'triangle';
        arpOsc.frequency.setValueAtTime(noteFreq, now);

        arpGain.gain.setValueAtTime(0.0001, now);
        arpGain.gain.linearRampToValueAtTime(0.035, now + 0.05);
        arpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        arpOsc.connect(arpGain);
        arpGain.connect(this.masterGain);

        arpOsc.start(now);
        arpOsc.stop(now + 0.5);

        // Soft sub-bass kick on beat 0 and 2
        if (subStep === 0 || subStep === 2) {
          const bassOsc = actx.createOscillator();
          const bassGain = actx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(chord[0] * 0.5, now);
          bassOsc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

          bassGain.gain.setValueAtTime(0.07, now);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

          bassOsc.connect(bassGain);
          bassGain.connect(this.masterGain);

          bassOsc.start(now);
          bassOsc.stop(now + 0.28);
        }
      } catch {
        // Fallback for audio buffer issues
      }

      this.step++;
    };

    // Trigger immediately then interval
    playBeat();
    const intervalMs = this.currentTrack === 'synthwave' ? 450 : this.currentTrack === 'cheerful' ? 520 : 680;
    this.timerId = window.setInterval(playBeat, intervalMs);
  }
}

export const bgm = new BgmEngine();
