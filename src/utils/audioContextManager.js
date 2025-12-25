let audioContext = null;
let unlocked = false;

export function getAudioContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
  }
  return audioContext;
}

// Funkcja odblokowująca AudioContext (na iOS 15 i starsze)
export function unlockAudioContext() {
  if (unlocked) return;

  const ctx = getAudioContext();

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  // Cichy bufor, żeby Safari uznało user gesture
  const buffer = ctx.createBuffer(1, 1, 22050);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);

  unlocked = true;
}
