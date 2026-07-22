/**
 * Web Audio API sound system – ported from game/script.js soundSystem
 */
let audioContext: AudioContext | null = null;

function init() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playPing(frequency: number, duration: number) {
  init();
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

export const soundSystem = {
  init,

  memoryCorrect() {
    playPing(523.25, 0.1);
    setTimeout(() => playPing(659.25, 0.15), 120);
  },

  ballCorrect() {
    playPing(783.99, 0.12);
  },

  wordCorrect() {
    playPing(392.0, 0.15);
  },

  arrowCorrect() {
    playPing(659.25, 0.15);
  },

  wrong() {
    init();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
    oscillator.type = "sawtooth";

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  },

  levelUp() {
    playPing(523.25, 0.1);
    setTimeout(() => playPing(659.25, 0.1), 100);
    setTimeout(() => playPing(783.99, 0.15), 200);
  },

  countdownBeep() {
    playPing(880, 0.08);
  },
};
