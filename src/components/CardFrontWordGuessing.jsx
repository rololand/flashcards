import { useEffect } from 'react';

import { useTTS } from '../states/tts';
import { useFormik } from 'formik';

import { getColouredTitleCard } from '../utils.js'

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import CardHeader from './CardHeader.jsx'

import { currentCardState } from '../states/currentCard.js';
import { settings } from '../states/settings.js';


function CardFrontWordGuessing() {
  const lang = settings((state) => state.primaryLanguage)
  const isMuted = settings((state) => state.isMuted)

  const title = currentCardState((state) => state.word[lang])
  const subtitle = currentCardState((state) => state.hint[lang])
  const sentence = currentCardState((state) => state.sentence[lang])
  const setGuess = currentCardState((state) => state.setGuess)
  const setIsCardFlipped = currentCardState((state) => state.setIsCardFlipped)
  const setIsCurrentFront = currentCardState((state) => state.setIsCurrentFront)

  const speak = useTTS((state) => state.enqueue);
  
  useEffect(() => {
    if(!isMuted) {
      speak(title, lang);
    }
  }, [title, lang, isMuted, speak]);

  const handleCheckClick = () => {
    setIsCardFlipped(true)
    setIsCurrentFront(false)
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
      setGuess(data.word)
      console.log('submit!')
      console.log('guess', data.word)
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
      <form onSubmit={formik.handleSubmit} className="p-fluid" >
        <div className="field">
          <span className="p-float-label">
            <InputText autoComplete="off" id="word" name="word" value={formik.values.word} onChange={formik.handleChange} autoFocus
            className={classNames({ 'p-invalid': isFormFieldValid('word') })} />
          </span>
          {getFormErrorMessage('word')}
        </div>

        <Button type="submit" label="check" className="mt-2" />
      </form>
    );
  }

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <Card 
        title={getColouredTitleCard(title)}
        subTitle={subtitle} 
        footer={wordGuessingForm} 
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

export default CardFrontWordGuessing;