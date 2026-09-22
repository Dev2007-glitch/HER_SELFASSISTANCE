/**
 * BECOMING — NYC Focus Soundscape Engine (Web Audio API)
 * Procedural ambient audio synthesizer requiring zero external MP3s.
 * Generates soothing ambient focus audio: SoHo Rain, Brooklyn Loft Focus, Hudson Sunset Wind.
 */

class NYCSoundscapeEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentTrack = 'off'; // 'rain' | 'loft' | 'wind' | 'off'
    this.volume = 0.25;
    this.nodes = [];
    this.masterGain = null;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setTrack(trackName) {
    this.initContext();
    this.stop();

    this.currentTrack = trackName;
    if (trackName === 'off') {
      this.isPlaying = false;
      this.notifyListeners();
      return;
    }

    if (!this.audioCtx) return;

    this.isPlaying = true;
    if (trackName === 'rain') {
      this.startSohoRain();
    } else if (trackName === 'loft') {
      this.startBrooklynLoft();
    } else if (trackName === 'wind') {
      this.startHudsonWind();
    }

    this.notifyListeners();
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.audioCtx.currentTime, 0.05);
    }
  }

  stop() {
    this.nodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {
        // ignore disconnect errors
      }
    });
    this.nodes = [];
    this.isPlaying = false;
  }

  startSohoRain() {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    // Pink noise buffer for rain
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for gentle window rain
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    // Subtle gentle droplet variation
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(0);
    this.nodes.push(whiteNoise, filter, gain);
  }

  startBrooklynLoft() {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    // Warm chord drone (F major 7 / D minor warm harmonics)
    const freqs = [174.61, 220.0, 261.63, 329.63]; // F3, A3, C4, E4
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const gain = ctx.createGain();
      // Gentle pulsing lfo
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.1 + idx * 0.05, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.04, ctx.currentTime);
      lfo.connect(lfoGain.gain);

      gain.gain.setValueAtTime(0.08 / freqs.length, ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(0);
      lfo.start(0);
      this.nodes.push(osc, gain, lfo, lfoGain);
    });

    // Gentle vinyl crackle noise
    const bufferSize = ctx.sampleRate * 2;
    const crackleBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = crackleBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() < 0.002 ? (Math.random() * 2 - 1) * 0.4 : (Math.random() * 2 - 1) * 0.015;
    }
    const crackleSource = ctx.createBufferSource();
    crackleSource.buffer = crackleBuffer;
    crackleSource.loop = true;

    const crackleFilter = ctx.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.setValueAtTime(1400, ctx.currentTime);

    const crackleGain = ctx.createGain();
    crackleGain.gain.setValueAtTime(0.15, ctx.currentTime);

    crackleSource.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(this.masterGain);

    crackleSource.start(0);
    this.nodes.push(crackleSource, crackleFilter, crackleGain);
  }

  startHudsonWind() {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    // Brown noise for deep calm wind
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, ctx.currentTime);

    // Filter modulation for gentle wind gusts
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(120, ctx.currentTime);
    lfo.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(0);
    lfo.start(0);
    this.nodes.push(noise, filter, lfo, lfoGain, gain);
  }

  notifyListeners() {
    window.dispatchEvent(new CustomEvent('soundscape-state-changed', {
      detail: {
        isPlaying: this.isPlaying,
        currentTrack: this.currentTrack,
        volume: this.volume
      }
    }));
  }
}

export const soundscape = new NYCSoundscapeEngine();
