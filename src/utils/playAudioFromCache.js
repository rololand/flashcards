import { getAudioContext } from './audioContextManager';
import { getAudioFromCache } from './audioCacheDB';
import { fetchAndCacheAudio } from './fetchAndCacheAudio'; // Twoja funkcja TTS

export const playAudioFromCache = async (text, lang = 'pl-PL') => {
  try {
    // 🔹 jeśli tekst jest pusty lub null, nic nie robimy
    if (!text || text.trim() === '') return;

    const cacheKey = `${lang}::${text}`;

    // 1️⃣ Spróbuj pobrać z IndexedDB
    let arrayBuffer = await getAudioFromCache(cacheKey);

    // 2️⃣ Jeśli nie ma w cache, pobierz z TTS i zapisz do IndexedDB
    if (!arrayBuffer) {
      await fetchAndCacheAudio(text, lang);
      arrayBuffer = await getAudioFromCache(cacheKey);

      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        console.warn('[TTS] Brak audio nawet po fetch:', cacheKey);
        return;
      }
    }

    // 3️⃣ Odtwarzanie
    const ctx = getAudioContext();

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // 🔹 callbackowa wersja decodeAudioData, bez rzucania wyjątków
    ctx.decodeAudioData(
      arrayBuffer.slice(0),
      (decodedBuffer) => {
        try {
          const source = ctx.createBufferSource();
          source.buffer = decodedBuffer;
          source.connect(ctx.destination);
          source.start(0);
        } catch (err) {
          console.error('[TTS] Błąd odtwarzania audio:', err);
        }
      },
      (err) => {
        console.error('[TTS] decodeAudioData error:', err);
      }
    );
  } catch (err) {
    console.error('[TTS] playAudioFromCache failed:', err);
  }
};
