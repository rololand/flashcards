import axios from 'axios';
import dayjs from 'dayjs';

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useEventListener } from 'primereact/hooks';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';

function WordGuessing(props) {
  const onKeyDown = (e) => {
    if (e.code === 'Enter') {
      if (isCardFlipped) {
        handleContinueClick()
      }
      return;
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

  const emptyWord = {
    "id": '',
    "pl": '',
    "de": '',
    "it": '',
    "es": '',
    "sentence_pl": '',
    "sentence_de": '',
    "sentence_it": '',
    "sentence_es": '',
    "date_ola": '',
    "date_rol": '',
    "hint_pl": '',
    "hint_de": '',
    "hint_it": '',
    "hint_es": '',
    "rank_ola": '',
    "rank_rol": ''
  }

  const [wordsToDo, setWordsToDo] = useState(props.wordsToDo)
  const [currentCard, setCurrentCard] = useState(wordsToDo[0])
    

  const [isCurrentFront, setIsCurrentFront] = useState(true)
  const [isCardFlipped, setIsCardFlipped] = useState(false)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [lang, setLang] = useState('pl-PL')
  const [result, setResult] = useState(false)
  const [guess, setGuess] = useState('')
  const [isMuted, setIsMuted] = useState(true)
  const [isPolishMuted, setIsPolishMuted] = useState(false)
  const speech = new SpeechSynthesisUtterance()
    
  useEffect(() => {
    setCurrentCard(wordsToDo[0])
    setIsCardFlipped(false)
    setIsCurrentFront(true)
  }, [wordsToDo])

  useEffect(() => {
    if (isCurrentFront) {
      setTitle(currentCard.pl)
      setSubtitle(currentCard.hint_pl)
      setLang('pl-PL')
    } else {
      setTitle(currentCard.de)
      setSubtitle(currentCard.pl)
      setLang('de-DE')
    }
  }, [isCurrentFront, currentCard])

  useEffect(() => {
    speech.text = title
    speech.lang = lang
    if (lang === 'pl-PL') {
      if (isPolishMuted === false && isMuted === false) {
        window.speechSynthesis.speak(speech)
      }
        
    } else if (lang === 'de-DE'){
      if ((isMuted === false) ) {
        window.speechSynthesis.speak(speech)
      }
    }
  }, [title])

  const calculateNewDate = (rank) => {
    const today = dayjs()
    let newDay;

    if (rank === 0 || rank === null) {
      newDay = today.add(1, 'day')
    } else if (rank === 1) {
      newDay = today.add(1, 'day')
    } else if (rank === 2) {
      newDay = today.add(2, 'day')
    } else if (rank === 3) {
      newDay = today.add(3, 'day')
    } else if (rank === 4) {
      newDay = today.add(7, 'day')
    } else if (rank === 5) {
      newDay = today.add(14, 'day')
    } else if (rank === 6) {
      newDay = today.add(21, 'day')
    } else if (rank === 7) {
      newDay = today.add(30, 'day')
    } else if (rank === 8) {
      newDay = today.add(45, 'day')
    } else if (rank === 9) {
      newDay = today.add(60, 'day')
    } else if (rank === 10) {
      newDay = today.add(90, 'day')
    }
    return newDay.format('YYYY-MM-DD').toString()
  }

  const increaseRank = (rank) => {
    if (rank >= 10)
      return 10
    return rank + 1
  }

  const decreaseRank = (rank) => {
    if (rank <= 0)
      return 0
    return rank - 1
  }

  const handleCheckClick = () => {
    setIsCardFlipped(!isCardFlipped)
    setIsCurrentFront(!isCurrentFront)
  }

  const handleNokClick = () => {
    // update rank
    let newCurrentCard = {...currentCard}
    let newWordsToDo = [...wordsToDo]
    let rank = 0
    if (props.userName === 'Roland') {
      rank = newCurrentCard.rank_rol
    } else if (props.userName === 'Ola') {
      rank = newCurrentCard.rank_ola
    }
    if (props.userName === 'Roland') {
      newCurrentCard.rank_rol = decreaseRank(rank)
    } else if (props.userName === 'Ola') {
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
    if (props.userName === 'Roland') {
      rank = newCurrentCard.rank_rol
    } else if (props.userName === 'Ola') {
      rank = newCurrentCard.rank_ola
    }
    if (props.userName === 'Roland') {
      newCurrentCard.date_rol = calculateNewDate(rank)
      newCurrentCard.rank_rol = increaseRank(rank)
    } else if (props.userName === 'Ola') {
      newCurrentCard.date_ola = calculateNewDate(rank)
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

  const MuteSwitch = () => {
    return (
      <div className="flex align-items-center gap-2">
        <InputSwitch checked={isMuted} onChange={(e) => setIsMuted(e.value)} />
        <span className="font-bold text-bluegray-50">mute</span>
      </div>
    )
  }
  const MutePolishSwitch = () => {
    return (
      <div className="flex align-items-center gap-2">
        <span className="font-bold text-bluegray-50">mute polish</span>
        <InputSwitch checked={isPolishMuted} onChange={(e) => setIsPolishMuted(e.value)} />
      </div>
    )
  }

  const header = () => {
    return <Toolbar start={MuteSwitch} end={MutePolishSwitch} className="bg-gray-900 shadow-2" />
  }

  const titleCard = () => {
    const prefix = title.substring(0, 4)
    if (prefix === 'der ') {
      return <div className="text-green-500">{title}</div>
    } else if (prefix === 'die ') {
      return <div className="text-pink-500">{title}</div>
    } else if (prefix === 'das ') {
      return <div className="text-orange-500">{title}</div>
    }
    return title
  }

  const replaceSpecialCharacters = (word) => {
    return word
    .toLowerCase()
    .replaceAll('ä', 'a')
    .replaceAll('ö', 'o')
    .replaceAll('ü', 'u')
    .replaceAll('ß', 'ss')
  }

  const compareWords = (a, b) => {
    a = replaceSpecialCharacters(a)
    b = replaceSpecialCharacters(b)

    return a === b
  }

  const formik = useFormik({
    initialValues: {
      word: '',
    },
    validate: (data) => {
      let errors = {};

      if (!data.word) {
        errors.word = 'Word is required.';
      }

      return errors;
    },
    onSubmit: (data) => {
      let result
      result = compareWords(data.word, currentCard.de)
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
      <Card title={titleCard} subTitle={subtitle} footer={footer} header={header} className="md:w-25rem">
        <div className="m-0">
          {sentence()}
        </div>
        <div className="m-0">
          {displayResult()}
        </div>
      </Card>
    </div>
  );
}
  
export default WordGuessing;
  