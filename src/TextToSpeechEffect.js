import { useEffect, useRef } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

import { settings } from './states/settings';

const TextToSpeechEffect = ({ title, lang, isMuted }) => {
  const synthesizerRef = useRef(null);

  const tokenRef = settings((state) => state.tokenRef)
  const regionRef = settings((state) => state.regionRef)

  // Efekt odczytu `title` po każdej zmianie
  useEffect(() => {
    const speak = async (text) => {
      if (!text || text.trim() === '') return;
      if (!tokenRef || !regionRef) {
        console.warn('[Azure TTS] Token not ready yet');
        return;
      }

      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
        tokenRef,
        regionRef
      );
      if (lang === 'pl-PL') {
        speechConfig.speechSynthesisVoiceName = 'pl-PL-ZofiaNeural';
        speechConfig.speechSynthesisLanguage = 'pl-PL';
      } else if (lang === 'de-DE'){
        speechConfig.speechSynthesisVoiceName = 'de-DE-KatjaNeural';
        speechConfig.speechSynthesisLanguage = 'de-DE';
      } else if (lang === 'en-GB'){
        speechConfig.speechSynthesisVoiceName = 'en-GB-AbbiNeural';
        speechConfig.speechSynthesisLanguage = 'en-GB';
      } else if (lang === 'it-IT'){
        speechConfig.speechSynthesisVoiceName = 'it-IT-IsabellaNeural';
        speechConfig.speechSynthesisLanguage = 'it-IT';
      } else if (lang === 'es-ES'){
        speechConfig.speechSynthesisVoiceName = 'es-ES-XimenaNeural';
        speechConfig.speechSynthesisLanguage = 'es-ES';
      }

      const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();

      if (synthesizerRef.current) {
        synthesizerRef.current.close();
      }

      const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
      synthesizerRef.current = synthesizer;

      if (isMuted === false) {
        synthesizer.speakTextAsync(
          text,
          result => {
            if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            } else {
              console.error('[Azure TTS] Błąd:', result.errorDetails);
            }
            synthesizer.close();
            synthesizerRef.current = null;
          },
          err => {
            console.error('[Azure TTS] Błąd syntezatora:', err);
            synthesizer.close();
            synthesizerRef.current = null;
          }
        );
      }
      
    };

    speak(title);
  }, [title, lang, isMuted, regionRef, tokenRef]);

  return null; // nic nie renderujemy
};

export default TextToSpeechEffect;
