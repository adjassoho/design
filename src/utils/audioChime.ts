// Synthesized serene ambient celestial chime & hymn organ tones using standard Web Audio API

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let timeoutId: any = null;

const chordProgression = [
  // F Major celestial triad
  [349.23, 440.0, 523.25, 698.46],
  // C Major
  [261.63, 329.63, 392.0, 523.25],
  // D minor
  [293.66, 349.23, 440.0, 587.33],
  // B-flat Major
  [233.08, 293.66, 349.23, 466.16],
];

export function toggleMemorialAudio(onStateChange?: (playing: boolean) => void): boolean {
  if (isPlaying) {
    stopMemorialAudio();
    if (onStateChange) onStateChange(false);
    return false;
  } else {
    startMemorialAudio();
    if (onStateChange) onStateChange(true);
    return true;
  }
}

export function startMemorialAudio() {
  if (typeof window === 'undefined') return;

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    let chordIndex = 0;

    const playNextChord = () => {
      if (!isPlaying || !audioCtx) return;

      const chord = chordProgression[chordIndex % chordProgression.length];
      chordIndex++;

      const now = audioCtx.currentTime;
      const duration = 4.5;

      chord.forEach((freq, idx) => {
        const osc = audioCtx!.createOscillator();
        const gain = audioCtx!.createGain();

        // Warm sine + triangle blend
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Soft angelic envelope
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.04 / chord.length, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(audioCtx!.destination);

        osc.start(now);
        osc.stop(now + duration);
      });

      timeoutId = setTimeout(playNextChord, 4200);
    };

    playNextChord();
  } catch (err) {
    console.warn('Audio context init error:', err);
  }
}

export function stopMemorialAudio() {
  isPlaying = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}
