import { useEventListener } from 'primereact/hooks';
import { useEffect, Fragment } from 'react';

import { useTTS } from '../states/tts';

import { getColouredTitleCard, compareWords } from '../utils.js'

import { Card } from "primereact/card";
import { Button } from 'primereact/button';

import CardHeader from './CardHeader.jsx'

import { currentCardState } from '../states/currentCard';
import { settings } from '../states/settings';
import { wordsToDoState } from '../states/wordsToDo.js';

import { playAudioFromCache } from '../playAudioFromCache.js'


function CardBackWordGuessing() {
  const primaryLanguage = settings((state) => state.primaryLanguage)
  const secondaryLanguage = settings((state) => state.secondaryLanguage)
  const isMuted = settings((state) => state.isMuted)

  const handleNokClick = wordsToDoState((state) => state.handleNokClick);
  const handleOkClick = wordsToDoState((state) => state.handleOkClick);

  const primaryTitle = currentCardState((state) => state.word[primaryLanguage])
  const primarySubtitle = currentCardState((state) => state.hint[primaryLanguage])
  const primarySentence = currentCardState((state) => state.sentence[primaryLanguage])
  const secondaryTitle = currentCardState((state) => state.word[secondaryLanguage])
  const secondarySubtitle = currentCardState((state) => state.hint[secondaryLanguage])
  const secondarySentence = currentCardState((state) => state.sentence[secondaryLanguage])

  const result = currentCardState((state) => state.result)
  const setResult = currentCardState((state) => state.setResult)
  const guess = currentCardState((state) => state.guess)

  const speak = useTTS((state) => state.enqueue);

  const onKeyDown = (e) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      e.stopPropagation()
      handleContinueClick()
    } else if (e.code === 'F1') {
      setResult(true)
    }
  };
  
  const [bindKeyDown, unbindKeyDown] = useEventListener({
    type: 'keydown',
    listener: (e) => {
      onKeyDown(e);
    }
  });
  
  const [bindKeyUp, unbindKeyUp] = useEventListener({
    type: 'keyup',
    listener: (e) => {
    }
  });

  useEffect(() => {
    if(!isMuted) {
      // speak(secondaryTitle, secondaryLanguage);
      playAudioFromCache(secondaryTitle, secondaryLanguage)
    }
  }, [secondaryTitle, secondaryLanguage, isMuted, speak]);
  
  useEffect(() => {
    bindKeyDown();
    bindKeyUp();

    return () => {
      unbindKeyDown();
      unbindKeyUp();
    };
  }, [bindKeyDown, bindKeyUp, unbindKeyDown, unbindKeyUp]);

  const handleContinueClick = () => {
    if (result) {
      handleOkClick()
    } else {
      handleNokClick()
    }
  }

  useEffect(() => {
      setResult(compareWords(guess, secondaryTitle, secondarySubtitle))
  }, [guess, secondaryTitle, secondarySubtitle, setResult])

  const displayResult = () => {
    if (result) {
      return <div className="text-5xl font-bold text-teal-200" >
        EXCELLENT !
      </div>
    }
    return <div>
      <div className="text-5xl font-bold text-red-700" >TRY AGAIN</div>
      <p>Your guess: {guess} </p>
    </div>
  }

  const displayTitle = () => {
    if (secondarySubtitle) {
      return <span>
      <p>{getColouredTitleCard(secondaryTitle)}{' '}
      ({secondarySubtitle
        .split(',')
        .map((title, i, arr) => (
          <Fragment key={i}>
            {getColouredTitleCard(title.trim())}
            {i < arr.length - 1 && ', '}
          </Fragment>
        ))})
      </p>
    </span>
    }
    return <span>
      <p>{getColouredTitleCard(secondaryTitle)}</p>
    </span>
  }

  const displaySubtitle = () => {
    if (primarySubtitle) {
      return <span>
      <p>{getColouredTitleCard(primaryTitle)}{' '}
      ({primarySubtitle
        .split(',')
        .map((title, i, arr) => (
          <Fragment key={i}>
            {getColouredTitleCard(title.trim())}
            {i < arr.length - 1 && ', '}
          </Fragment>
        ))})
      </p>
    </span>
    }
    return <span>
      <p>{getColouredTitleCard(primaryTitle)}</p>
    </span>
  }

  const continueForm = () => {
    return (
        <Button type="submit" label="continue" className="mt-2" onClick={handleContinueClick} />
    );
  }

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <Card 
        title={displayTitle()}
        subTitle={displaySubtitle()} 
        footer={continueForm} 
        header={CardHeader}
        className="md:w-25rem"
      >
        <div className="m-0">
          <p>{secondarySentence}</p>
          <p>{primarySentence}</p>
        </div>
        <div className="m-0">
          {displayResult()}
        </div>
      </Card>
    </div>
  );
}

export default CardBackWordGuessing;