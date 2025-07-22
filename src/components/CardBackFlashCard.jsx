import { useEffect } from 'react';

import { useTTS } from '../states/tts';

import { getColouredTitleCard } from '../utils.js'

import { Card } from "primereact/card";

import CardHeader from './CardHeader.jsx'
import CardFooter from './CardFooter.jsx';

import { currentCardState } from '../states/currentCard';
import { settings } from '../states/settings';

import { playAudioFromCache } from '../playAudioFromCache.js'


function CardBackFlashCard() {
  const lang = settings((state) => state.secondaryLanguage)
  const isMuted = settings((state) => state.isMuted)

  const title = currentCardState((state) => state.word[lang])
  const subtitle = currentCardState((state) => state.hint[lang])
  const sentence = currentCardState((state) => state.sentence[lang])

  const speak = useTTS((state) => state.enqueue);
  
  useEffect(() => {
    if(!isMuted) {
      // speak(title, lang);
      playAudioFromCache(title, lang)
    }
  }, [title, lang, isMuted, speak]);

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <Card 
        title={getColouredTitleCard(title)}
        subTitle={subtitle} 
        footer={CardFooter} 
        header={CardHeader}
        className="md:w-25rem"
      >
        <p className="m-0">
          {sentence}
        </p>
      </Card>
    </div>
  );
}

export default CardBackFlashCard;