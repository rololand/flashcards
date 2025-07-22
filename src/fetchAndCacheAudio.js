import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { useTTS } from './states/tts';
import { settings } from './states/settings';

export const fetchAndCacheAudio = async (text, lang = 'pl-PL') => {
  const { tokenRef, regionRef } = settings.getState();
  const { cacheAudio, getAudioFromCache } = useTTS.getState();

  const cacheKey = `${lang}::${text}`;
  if (getAudioFromCache(cacheKey)) {
    return; // już w cache
  }

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
      (result) => {
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          cacheAudio(cacheKey, result.audioData);
          resolve();
        } else {
          reject(new Error(result.errorDetails));
        }
        synthesizer.close();
      },
      (err) => {
        synthesizer.close();
        reject(err);
      }
    );
  });
};
