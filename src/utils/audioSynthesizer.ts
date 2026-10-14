/**
 * Web Audio API based ambient sound generator and speech utility
 * 100% client-side, zero external audio dependency, runs offline smoothly.
 */

class AmbientSoundManager {
  private ctx: AudioContext | null = null;
  private currentMode: 'none' | 'rain' | 'starlight' | 'wind' = 'none';
  private masterGain: GainNode | null = null;
  private volume: number = 0.35;
  private activeNodes: (AudioNode | number)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume() {
    return this.volume;
  }

  public getCurrentMode() {
    return this.currentMode;
  }

  public stop() {
    this.cleanupActiveNodes();
    this.currentMode = 'none';
  }

  private cleanupActiveNodes() {
    this.activeNodes.forEach(item => {
      if (typeof item === 'number') {
        window.clearInterval(item);
      } else {
        try {
          if ('stop' in item && typeof (item as AudioScheduledSourceNode).stop === 'function') {
            (item as AudioScheduledSourceNode).stop();
          }
          item.disconnect();
        } catch {
          // ignore disconnect errors
        }
      }
    });
    this.activeNodes = [];
  }

  public playRain() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.cleanupActiveNodes();
    this.currentMode = 'rain';

    // White/Pink noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.11;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Bandpass filter for gentle rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, rainGain);

    // Random gentle droplet ping
    const dropInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentMode !== 'rain') return;
      try {
        const osc = this.ctx.createOscillator();
        const dropGain = this.ctx.createGain();
        osc.type = 'sine';
        const freq = 1200 + Math.random() * 800;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.12);

        dropGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

        osc.connect(dropGain);
        dropGain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.13);
      } catch {
        // ignore
      }
    }, 450);

    this.activeNodes.push(dropInterval);
  }

  public playStarlight() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.cleanupActiveNodes();
    this.currentMode = 'starlight';

    // Ethereal ambient harmonic chords
    const chordFrequencies = [220, 277.18, 329.63, 440, 554.37]; // A minor / C# maj dream
    chordFrequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Gentle LFO for breathing pitch
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.15 + idx * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(2.5, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.08 / chordFrequencies.length, this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      this.activeNodes.push(osc, gain, lfo, lfoGain);
    });
  }

  public playWind() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.cleanupActiveNodes();
    this.currentMode = 'wind';

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    // LFO modulate wind resonance
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter, gain, lfo, lfoGain);
  }
}

export const ambientSound = new AmbientSoundManager();

/**
 * Text-to-speech for dialogue preview using browser Web Speech API
 */
export function playVoiceSnippet(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.pitch = 0.82; // Lower, slightly deeper male tone
  utterance.rate = 0.88;  // Deliberate, relaxed, unhurried cadence

  const voices = window.speechSynthesis.getVoices();
  const chineseMale = voices.find(
    v => v.lang.includes('zh') && (v.name.includes('Male') || v.name.includes('Yunjian') || v.name.includes('Yunxi') || v.name.includes('Kangkang') || v.name.includes('Han'))
  ) || voices.find(v => v.lang.includes('zh'));

  if (chineseMale) {
    utterance.voice = chineseMale;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopVoice() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Copy to clipboard helper
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
