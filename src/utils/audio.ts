/**
 * Offline Web Audio API Synthesizer
 * Zero network requests, 100% offline-ready sound effects for MPI
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private bgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private bgmStep: number = 0;
  private bgmGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        this.bgmGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public isBgmActive(): boolean {
    return this.bgmPlaying;
  }

  public startBgm() {
    const ctx = this.getContext();
    if (!ctx || this.bgmPlaying) return;
    this.bgmPlaying = true;
    this.scheduleBgm();
  }

  public stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public toggleBgm(): boolean {
    if (this.bgmPlaying) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.bgmPlaying;
  }

  private scheduleBgm() {
    if (!this.bgmPlaying) return;
    const ctx = this.getContext();
    if (!ctx || !this.bgmGain) return;

    const now = ctx.currentTime;
    const beat = 0.32;
    const chords = [
      { bass: 130.81, notes: [261.63, 329.63, 392.00, 493.88] },
      { bass: 110.00, notes: [220.00, 261.63, 329.63, 392.00] },
      { bass: 87.31,  notes: [174.61, 261.63, 349.23, 440.00] },
      { bass: 98.00,  notes: [196.00, 293.66, 392.00, 493.88] },
    ];

    const chord = chords[Math.floor((this.bgmStep / 8) % chords.length)];
    const stepInBar = this.bgmStep % 8;

    if (stepInBar === 0) {
      this.playBgmTone(chord.bass, now, beat * 3.5, 'triangle', 0.08);
    }

    const note = chord.notes[stepInBar % chord.notes.length];
    this.playBgmTone(note, now, beat * 1.2, 'sine', 0.06);

    if (stepInBar === 2 || stepInBar === 5) {
      this.playBgmTone(note * 1.5, now + 0.05, beat * 0.9, 'sine', 0.04);
    }

    this.bgmStep++;
    this.bgmTimer = window.setTimeout(() => this.scheduleBgm(), beat * 1000);
  }

  private playBgmTone(freq: number, time: number, duration: number, type: OscillatorType, maxGain: number) {
    const ctx = this.getContext();
    if (!ctx || !this.bgmGain) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, time);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(maxGain, time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + duration);
    } catch {
      // Fallback
    }
  }

  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext failure fallback
    }
  }

  public playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Chime arpeggio: C5 -> G5
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc1.frequency.setValueAtTime(1046.50, now + 0.24); // C6

      osc2.frequency.setValueAtTime(523.25 * 0.5, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch {
      // Silent error fallback
    }
  }

  public playError() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.setValueAtTime(140, now + 0.1);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Silent error fallback
    }
  }

  public playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {
      // Silent error fallback
    }
  }
}

export const sound = new SoundEngine();
