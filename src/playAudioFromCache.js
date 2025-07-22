import { useTTS } from './states/tts';

export const playAudioFromCache = async (text, lang = 'pl-PL') => {
  const { getAudioFromCache } = useTTS.getState();
  const cacheKey = `${lang}::${text}`;
  const arrayBuffer = getAudioFromCache(cacheKey);

  if (!arrayBuffer) {
    console.warn('[TTS] Brak w cache:', cacheKey);
    return;
  }

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
  const source = audioContext.createBufferSource();
  source.buffer = decoded;
  source.connect(audioContext.destination);
  source.start(0);
};
