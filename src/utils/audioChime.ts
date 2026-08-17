// Synthesized Solemn Funeral Requiem & Church Organ / Minor Chords using Web Audio API

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let timeoutId: any = null;
let activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

// Deep, emotional minor requiem progression (D minor, G minor, A minor, B-flat, D minor)
const funeralProgression = [
  // D minor solemn chord (D3, F3, A3, D4) + low sub D2
  [73.42, 146.83, 174.61, 220.0, 293.66],
  // G minor melancholy chord (G2, G3, Bb3, D4)
  [98.0, 196.0, 233.08, 293.66, 392.0],
  // B-flat Major solemn sorrow (Bb2, F3, Bb3, D4)
  [116.54, 174.61, 233.08, 293.66, 349.23],
  // A minor poignant suspension (A2, E3, A3, C4, E4)
  [110.0, 164.81, 220.0, 261.63, 329.63],
  // D minor resolution with distant funeral bell chime (D2, A2, D3, F3, A3)
  [73.42, 110.0, 146.83, 174.61, 220.0],
];

export function toggleMemorialAudio(onStateChange?: (playing: boolean) => void): boolean {
  if (isPlaying) {
    stopMemorialAudio();
    if (onStateChange) onStateChange(false);
    return false;
  } else {
    startMemorialAudio(onStateChange);
    return true;
  }
}

export function startMemorialAudio(onStateChange?: (playing: boolean) => void) {
  if (typeof window === 'undefined') return;

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Stop any existing loop first
    stopMemorialAudio();

    isPlaying = true;
    if (onStateChange) onStateChange(true);

    let chordIndex = 0;

    const playNextFuneralChord = () => {
      if (!isPlaying || !audioCtx) return;

      const chord = funeralProgression[chordIndex % funeralProgression.length];
      chordIndex++;

      const now = audioCtx.currentTime;
      const duration = 5.2; // Long slow solemn resonance

      // Clean up previous dead oscs
      activeOscillators = [];

      // 1. Play deep pipe organ & soft cello pad tones
      chord.forEach((freq, idx) => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Blend rich dark organ tones
        osc.type = idx === 0 ? 'sine' : idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Low pass filter for warm solemn vintage church organ depth
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(idx === 0 ? 250 : 850, now);

        // Smooth solemn attack and long dying decay
        const maxGain = idx === 0 ? 0.04 : 0.025 / chord.length;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(maxGain, now + 1.6);
        gain.gain.exponentialRampToValueAtTime(0.00005, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration);

        activeOscillators.push({ osc, gain });
      });

      // 2. Add subtle solemn funeral church bell toll on the first chord of cycle
      if (chordIndex % funeralProgression.length === 1 && audioCtx) {
        const bellOsc = audioCtx.createOscillator();
        const bellGain = audioCtx.createGain();
        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(220.0, now + 0.1); // A3 toll

        bellGain.gain.setValueAtTime(0.0001, now + 0.1);
        bellGain.gain.exponentialRampToValueAtTime(0.02, now + 0.15);
        bellGain.gain.exponentialRampToValueAtTime(0.00001, now + 3.8);

        bellOsc.connect(bellGain);
        bellGain.connect(audioCtx.destination);
        bellOsc.start(now + 0.1);
        bellOsc.stop(now + 4.0);
      }

      // Loop seamlessly
      timeoutId = setTimeout(playNextFuneralChord, 4900);
    };

    playNextFuneralChord();
  } catch (err) {
    console.warn('Audio context init error:', err);
  }
}

export function stopMemorialAudio(onStateChange?: (playing: boolean) => void) {
  isPlaying = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  if (activeOscillators.length > 0) {
    activeOscillators.forEach(({ osc, gain }) => {
      try {
        if (audioCtx) {
          gain.gain.linearRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
          setTimeout(() => osc.stop(), 350);
        }
      } catch (e) {}
    });
    activeOscillators = [];
  }
  if (onStateChange) onStateChange(false);
}

export function isMemorialAudioPlaying(): boolean {
  return isPlaying;
}
