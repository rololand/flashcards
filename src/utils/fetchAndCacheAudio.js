import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { settings } from '../states/settings';
import { cacheAudio, getAudioFromCache } from './audioCacheDB';

export const fetchAndCacheAudio = async (text, lang = 'pl-PL') => {
  const { tokenRef, regionRef } = settings.getState();
  const cacheKey = `${lang}::${text}`;

  // Sprawdzenie cache w IndexedDB
  const cached = await getAudioFromCache(cacheKey);
  if (cached) return; // już w cache

  const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(tokenRef, regionRef);

  const voices = {
    'pl-PL': 'pl-PL-ZofiaNeural',
    'de-DE': 'de-DE-KatjaNeural',
    'en-GB': 'en-GB-AbbiNeural',
    'it-IT': 'it-IT-IsabellaNeural',
    'es-ES': 'es-ES-XimenaNeural',
  };

  speechConfig.speechSynthesisVoiceName = voices[lang] || 'pl-PL-ZofiaNeural';
  speechConfig.speechSynthesisLanguage = lang;

  const stream = SpeechSDK.AudioOutputStream.createPullStream();
  const audioConfig = SpeechSDK.AudioConfig.fromStreamOutput(stream);
  const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

  return new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      async (result) => {
        synthesizer.close();
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          try {
            await cacheAudio(cacheKey, result.audioData);
            resolve();
          } catch (err) {
            console.error('[TTS] Błąd zapisu do IndexedDB:', err);
            resolve(); // mimo błędu zapisania i tak kontynuujemy
          }
        } else {
          reject(new Error(result.errorDetails));
        }
      },
      (err) => {
        synthesizer.close();
        reject(err);
      }
    );
  });
};
