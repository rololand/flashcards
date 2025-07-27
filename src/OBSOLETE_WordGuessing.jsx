import axios from 'axios';
import TextToSpeechEffect from './TextToSpeechEffect.js';

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useEventListener } from 'primereact/hooks';
import { MuteSwitch } from './components/MuteSwitch.jsx';

import { useEffect } from 'react';
import { useFormik } from 'formik';

import { getNewDate, emptyWord, increaseRank, decreaseRank, getColouredTitleCard, compareWords } from './utils.js'

import { settings } from './states/settings.js';
import { wordsToDoState } from './states/wordsToDo.js';
import { userState } from './states/user.js';
import { currentCardState } from './states/currentCard.js';

function WordGuessing(props) {
  const isMuted = settings((state) => state.isMuted)

  const wordsToDo = wordsToDoState((state) => state.wordsToDo)
  const setWordsToDo = wordsToDoState((state) => state.setWordsToDo)

  const userName = userState((state) => state.userName)

  const currentCard = currentCardState((state) => state.currentCard)
  const setCurrentCard = currentCardState((state) => state.setCurrentCard)

  const isCurrentFront = currentCardState((state) => state.isCurrentFront)
  const setIsCurrentFront = currentCardState((state) => state.setIsCurrentFront)

  const isCardFlipped = currentCardState((state) => state.isCardFlipped)
  const setIsCardFlipped = currentCardState((state) => state.setIsCardFlipped)

  const title = currentCardState((state) => state.title)
  const setTitle = currentCardState((state) => state.setTitle)

  const subtitle = currentCardState((state) => state.subtitle)
  const setSubtitle = currentCardState((state) => state.setSubtitle)

  const lang = currentCardState((state) => state.lang)
  const setLang = currentCardState((state) => state.setLang)

  const result = currentCardState((state) => state.result)
  const setResult = currentCardState((state) => state.setResult)

  const guess = currentCardState((state) => state.guess)
  const setGuess = currentCardState((state) => state.setGuess)

  const onKeyDown = (e) => {
    if (e.code === 'Enter') {
      console.log('enter')
      if (isCardFlipped) {
        console.log('card is flipped')
        handleContinueClick()
      }
      return;
    } else if (e.code === 'F1') {
      setResult(true)
    } else if (e.code === 'Escape') {
      props.handleBackClick()
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
      bindKeyDown();
      bindKeyUp();

      return () => {
          unbindKeyDown();
          unbindKeyUp();
      };
  }, [bindKeyDown, bindKeyUp, unbindKeyDown, unbindKeyUp]);

    
  useEffect(() => {
    console.log('new words to do')
    setIsCardFlipped(false)
    setIsCurrentFront(true)
    setCurrentCard(wordsToDo[0])
  }, [wordsToDo])

  useEffect(() => {
    if (isCurrentFront) {
      console.log('front')
      setTitle(currentCard.pl)
      setSubtitle(currentCard.hint_pl)
      setLang('pl-PL')
    } else {
      console.log('back')
      if (currentCard.hint_de) {
        setTitle(currentCard.de + ' (' + currentCard.hint_de + ')')
      } else {
        setTitle(currentCard.de)
      }
      if (currentCard.hint_pl) {
        setSubtitle(currentCard.pl + ' (' + currentCard.hint_pl + ')')
      } else {
        setSubtitle(currentCard.pl)
      }
      setLang('de-DE')
    }
  }, [isCurrentFront, currentCard])

  const handleCheckClick = () => {
    setIsCardFlipped(true)
    // setIsCurrentFront(false)
  }

  const handleNokClick = () => {
    // update rank
    let newCurrentCard = {...currentCard}
    let newWordsToDo = [...wordsToDo]
    let rank = 0
    if (userName === 'Roland') {
      rank = newCurrentCard.rank_rol
    } else if (userName === 'Ola') {
      rank = newCurrentCard.rank_ola
    }
    if (userName === 'Roland') {
      newCurrentCard.rank_rol = decreaseRank(rank)
    } else if (userName === 'Ola') {
      newCurrentCard.rank_ola = decreaseRank(rank)
    }
    // remove currentCard (index 0) from list toDo
    newWordsToDo = newWordsToDo.slice(1)
    // add newCurrentCard to list toDo
    newWordsToDo = [...newWordsToDo, newCurrentCard]
    // update wordToDo
    setWordsToDo(newWordsToDo)

  }

  const handleOkClick = () => {
    // update date and rank
    let newCurrentCard = {...currentCard}
    let newWordsToDo = [...wordsToDo]
    let rank = 0
    if (userName === 'Roland') {
      rank = newCurrentCard.rank_rol
    } else if (userName === 'Ola') {
      rank = newCurrentCard.rank_ola
    }
    if (userName === 'Roland') {
      newCurrentCard.date_rol = getNewDate(rank)
      newCurrentCard.rank_rol = increaseRank(rank)
    } else if (userName === 'Ola') {
      newCurrentCard.date_ola = getNewDate(rank)
      newCurrentCard.rank_ola = increaseRank(rank)
    }

    // update sql
    const azure_url = 'https://flashcardsfunction.azurewebsites.net/api/words'
    axios.put(azure_url, newCurrentCard)
    .then(res => {
      // remove from the list
      newWordsToDo = newWordsToDo.slice(1)
      // update list and set done flag if needed
      if (newWordsToDo.length === 0) {
        props.displayExerciseSummary()
        setCurrentCard(emptyWord)
      }
      setWordsToDo(newWordsToDo)
    })
    .catch(err => {
      console.log('Error: ' + err);
    });
  }

  const header = () => {
    return <Toolbar start={MuteSwitch} className="bg-gray-900 shadow-2" />
  }

  const formik = useFormik({
    initialValues: {
      word: '',
    },
    validate: (data) => {
      let errors = {};

      // if (!data.word) {
      //   errors.word = 'Word is required.';
      // }

      return errors;
    },
    onSubmit: (data) => {
      let result
      result = compareWords(data.word, currentCard.de, currentCard.hint_de)
      setResult(result)
      setGuess(data.word)
      handleCheckClick();
      formik.resetForm();
    }
  });

  const isFormFieldValid = (word) => !!(formik.touched[word] && formik.errors[word]);
  const getFormErrorMessage = (word) => {
    return isFormFieldValid(word) && <small className="p-error">{formik.errors[word]}</small>;
  };

  const wordGuessingForm = () => {
    return (
      <form onSubmit={formik.handleSubmit} className="p-fluid">
        <div className="field">
          <span className="p-float-label">
            <InputText autoComplete="off" id="word" name="word" value={formik.values.word} onChange={formik.handleChange} autoFocus
              className={classNames({ 'p-invalid': isFormFieldValid('word') })} />
          </span>
          {getFormErrorMessage('word')}
        </div>

        <Button type="submit" label="check" className="mt-2" />
        <p>{props.loginErrMsg}</p>
      </form>
  
    );
  }

  const handleContinueClick = () => {
    console.log('continue')
    setResult(false)
    setIsCardFlipped(false)
    if (result) {
      handleOkClick()
    } else {
      handleNokClick()
    }
    
  }

  const continueForm = () => {
    return (
        <Button type="submit" label="continue" className="mt-2" onClick={handleContinueClick} />
    );
  }

  const footer = () => {
    if (isCardFlipped) {
      return continueForm()
    } else {
      return wordGuessingForm()
    }
  }

  const sentence = () => {
    if (isCardFlipped) {
      return <div>
      <p>{currentCard.sentence_de}</p>
      <p>{currentCard.sentence_pl}</p>
    </div>
    } else {
      return <div>
        <p>{currentCard.sentence_pl}</p>
      </div>
    }
  }

  const displayResult = () => {
    if (isCardFlipped) {
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
    return
  }

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <Card title={getColouredTitleCard(title)} subTitle={subtitle} footer={footer} header={header} className="md:w-25rem">
        <div className="m-0">
          {sentence()}
        </div>
        <div className="m-0">
          {displayResult()}
        </div>
      </Card>
      <TextToSpeechEffect title={title} lang={lang} isMuted={isMuted} />
    </div>
  );
}
  
export default WordGuessing;
  