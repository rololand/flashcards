// components/TextToSpeechEngine.js
import { useEffect } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { useTTS } from '../states/tts';
import { settings } from '../states/settings';

const TextToSpeechEngine = () => {
  const queue = useTTS((state) => state.queue);
  const isSpeaking = useTTS((state) => state.isSpeaking);
  const dequeue = useTTS((state) => state.dequeue);
  const setSpeaking = useTTS((state) => state.setSpeaking);

  const tokenRef = settings((state) => state.tokenRef);
  const regionRef = settings((state) => state.regionRef);

  const setSynthesizer = useTTS((state) => state.setSynthesizer);
  const markDisposed = useTTS((state) => state.markDisposed);

  useEffect(() => {
    if (!tokenRef || !regionRef || isSpeaking || queue.length === 0) return;

    const { text, lang } = queue[0];
    if (!text) {
      dequeue();
      return;
    }

    const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(tokenRef, regionRef);
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();

    if (lang === 'pl-PL') {
      speechConfig.speechSynthesisVoiceName = 'pl-PL-ZofiaNeural';
    } else if (lang === 'de-DE') {
      speechConfig.speechSynthesisVoiceName = 'de-DE-KatjaNeural';
    }

    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
    setSynthesizer(synthesizer);
    setSpeaking(true);

    synthesizer.speakTextAsync(
      text,
      result => {
        if (result.reason !== SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.error('[Azure TTS] Błąd:', result.errorDetails);
        }
        synthesizer.close();
        markDisposed()
        setSpeaking(false);
        dequeue();
      },
      err => {
        console.error('[Azure TTS] Błąd syntezatora:', err);
        synthesizer.close();
        markDisposed()
        setSpeaking(false);
        dequeue();
      }
    );

  }, [queue, isSpeaking, tokenRef, regionRef, dequeue, setSpeaking, setSynthesizer, markDisposed]);

  return null;
};

export default TextToSpeechEngine;
