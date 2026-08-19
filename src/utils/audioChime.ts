// Synthesized Solemn Funeral Requiem & Cathedral Organ / Minor Chords using Web Audio API

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let timeoutId: any = null;
let activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
let currentVolumeLevel = 0.85; // Amplified rich default volume
let listenersAttached = false;
let globalStateCallback: ((playing: boolean) => void) | null = null;

// Deep, emotional minor requiem progression (D minor, G minor, B-flat, A minor, D minor resolution)
const funeralProgression = [
  // D minor solemn cathedral chord (D3, F3, A3, D4) + deep bass D2
  [73.42, 146.83, 174.61, 220.0, 293.66],
  // G minor melancholy chord (G2, G3, Bb3, D4, G4)
  [98.0, 196.0, 233.08, 293.66, 392.0],
  // B-flat Major solemn hope (Bb2, F3, Bb3, D4, F4)
  [116.54, 174.61, 233.08, 293.66, 349.23],
  // A minor poignant suspension (A2, E3, A3, C4, E4)
  [110.0, 164.81, 220.0, 261.63, 329.63],
  // D minor resolution with resonant cathedral organ (D2, A2, D3, F3, A3)
  [73.42, 110.0, 146.83, 174.61, 220.0],
];

// Automatically attach page lifecycle listeners to stop music when the user leaves or switches tabs
function attachPageExitListeners() {
  if (listenersAttached || typeof window === 'undefined') return;

  // 1. When user switches tabs, minimizes window, or locks screen
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && isPlaying) {
      stopMemorialAudio(globalStateCallback || undefined);
    }
  });

  // 2. When user navigates away or closes page
  window.addEventListener('pagehide', () => {
    if (isPlaying) {
      stopMemorialAudio(globalStateCallback || undefined);
    }
  });

  // 3. Before unloading window
  window.addEventListener('beforeunload', () => {
    if (isPlaying) {
      stopMemorialAudio(globalStateCallback || undefined);
    }
  });

  listenersAttached = true;
}

export function setMemorialAudioVolume(volume: number) {
  currentVolumeLevel = Math.max(0, Math.min(1, volume));
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.setValueAtTime(currentVolumeLevel, audioCtx.currentTime);
    } catch (e) {}
  }
}

export function getMemorialAudioVolume(): number {
  return currentVolumeLevel;
}

export function toggleMemorialAudio(onStateChange?: (playing: boolean) => void): boolean {
  if (isPlaying) {
    stopMemorialAudio(onStateChange);
    return false;
  } else {
    startMemorialAudio(onStateChange);
    return true;
  }
}

export function startMemorialAudio(onStateChange?: (playing: boolean) => void) {
  if (typeof window === 'undefined') return;

  attachPageExitListeners();
  if (onStateChange) {
    globalStateCallback = onStateChange;
  }

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!masterGain) {
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(currentVolumeLevel, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }

    // Stop any existing loop first
    stopMemorialAudio();

    isPlaying = true;
    if (onStateChange) onStateChange(true);
    if (globalStateCallback) globalStateCallback(true);

    let chordIndex = 0;

    const playNextFuneralChord = () => {
      if (!isPlaying || !audioCtx || !masterGain) return;

      const chord = funeralProgression[chordIndex % funeralProgression.length];
      chordIndex++;

      const now = audioCtx.currentTime;
      const duration = 5.4; // Rich slow cathedral resonance

      // Clean up previous dead oscs
      activeOscillators = [];

      // 1. Play deep pipe organ & majestic celestial pad tones (AMPLIFIED VOLUME)
      chord.forEach((freq, idx) => {
        if (!audioCtx || !masterGain) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Blend rich dark organ tones
        osc.type = idx === 0 ? 'sine' : idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Low pass filter for warm solemn cathedral organ acoustic
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(idx === 0 ? 320 : 1100, now);

        // Enhanced warm gain curve for clear audible presence
        const maxGain = idx === 0 ? 0.22 : 0.14 / Math.sqrt(chord.length);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(maxGain, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration);

        activeOscillators.push({ osc, gain });
      });

      // 2. Clear solemn cathedral toll on the first chord of each cycle
      if (chordIndex % funeralProgression.length === 1 && audioCtx && masterGain) {
        const bellOsc = audioCtx.createOscillator();
        const bellGain = audioCtx.createGain();
        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(220.0, now + 0.1); // A3 toll

        bellGain.gain.setValueAtTime(0.0001, now + 0.1);
        bellGain.gain.exponentialRampToValueAtTime(0.12, now + 0.15);
        bellGain.gain.exponentialRampToValueAtTime(0.00001, now + 4.2);

        bellOsc.connect(bellGain);
        bellGain.connect(masterGain);
        bellOsc.start(now + 0.1);
        bellOsc.stop(now + 4.5);
      }

      // Loop seamlessly
      timeoutId = setTimeout(playNextFuneralChord, 5000);
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
          gain.gain.linearRampToValueAtTime(0.00001, audioCtx.currentTime + 0.2);
          setTimeout(() => {
            try {
              osc.stop();
            } catch (e) {}
          }, 250);
        }
      } catch (e) {}
    });
    activeOscillators = [];
  }
  if (onStateChange) onStateChange(false);
  if (globalStateCallback) globalStateCallback(false);
}

export function isMemorialAudioPlaying(): boolean {
  return isPlaying;
}
