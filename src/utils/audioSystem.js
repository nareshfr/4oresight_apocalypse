// Web Audio API Synthesizer for 100% offline tactical audio effects

class AudioSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientNode = null;
    this.ambientGain = null;
    this.noiseNode = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute(targetState) {
    this.init();
    if (targetState !== undefined) {
      this.isMuted = targetState;
    } else {
      this.isMuted = !this.isMuted;
    }

    if (this.isMuted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
      this.playTacticalBeep(640, 0.08);
    }
    return !this.isMuted;
  }

  startAmbient() {
    if (!this.ctx || this.ambientGain) return;

    try {
      // Atmospheric low droning bunker / tactical station hum
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);
      this.ambientGain = masterGain;

      // Low frequency drone oscillator
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      const oscFilter = this.ctx.createBiquadFilter();
      oscFilter.type = 'lowpass';
      oscFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
      oscFilter.Q.setValueAtTime(4, this.ctx.currentTime);

      osc1.connect(oscFilter);
      oscFilter.connect(masterGain);
      osc1.start();
      this.ambientOsc = osc1;

      // Subtle atmospheric noise generator (simulates radio static / wind)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(280, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      whiteNoise.start();
      this.noiseNode = whiteNoise;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  stopAmbient() {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          if (this.ambientOsc) {
            try { this.ambientOsc.stop(); } catch { /* ignore */ }
            this.ambientOsc = null;
          }
          if (this.noiseNode) {
            try { this.noiseNode.stop(); } catch { /* ignore */ }
            this.noiseNode = null;
          }
          this.ambientGain = null;
        }, 320);
      }
    } catch {
      this.ambientGain = null;
    }
  }

  playTacticalBeep(freq = 880, duration = 0.05, type = 'sine') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // ignore audio errors
    }
  }

  playAlert() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [0, 0.14].forEach((delay) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(740, now + delay);
        osc.frequency.setValueAtTime(920, now + delay + 0.06);

        gain.gain.setValueAtTime(0.12, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.12);
      });
    } catch {
      // ignore
    }
  }

  playRadarPing() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch {
      // ignore
    }
  }
}

export const audioSystem = new AudioSystem();
