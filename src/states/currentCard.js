import { create } from 'zustand'
import { emptyWord } from '../utils'

export const currentCardState = create((set) => ({
  //do wykorzystania pozniej przy refactor logiki
  word: {
    "pl-PL": '',
    "de-DE": '',
    "en-GB": '',
    "it-IT": '',
    "es-ES": '',
  },

  sentence: {
    "pl-PL": '',
    "de-DE": '',
    "en-GB": '',
    "it-IT": '',
    "es-ES": '',
  },

  hint: {
    "pl-PL": '',
    "de-DE": '',
    "en-GB": '',
    "it-IT": '',
    "es-ES": '',
  },

  currentCard: emptyWord,
  setCurrentCard: (newCurrentCard) =>
    set(() => {
      // console.log('setting current card');
      return {
        currentCard: newCurrentCard,
        word: {
          "pl-PL": newCurrentCard['pl'],
          "de-DE": newCurrentCard['de'],
          "en-GB": newCurrentCard['en'],
          "it-IT": newCurrentCard['it'],
          "es-ES": newCurrentCard['es'],
        },
        sentence: {
          "pl-PL": newCurrentCard['sentence_pl'],
          "de-DE": newCurrentCard['sentence_de'],
          "en-GB": newCurrentCard['sentence_en'],
          "it-IT": newCurrentCard['sentence_it'],
          "es-ES": newCurrentCard['sentence_es'],
        },
        hint: {
          "pl-PL": newCurrentCard['hint_pl'],
          "de-DE": newCurrentCard['hint_de'],
          "en-GB": newCurrentCard['hint_en'],
          "it-IT": newCurrentCard['hint_it'],
          "es-ES": newCurrentCard['hint_es'],
        },
      };
    }),

  currentCardStatus: 'notFlipped',
  setCurrentCardStatus: (newCurrentCardStatus) =>
    set(() => {
      // console.log('setting current card status:', newCurrentCardStatus);
      return {
        currentCardStatus: newCurrentCardStatus,
      };
    }),

  isCurrentFront: true,
  setIsCurrentFront: (flag) =>
    set(() => {
      // console.log('setting current card front:', flag);
      return {
        isCurrentFront: flag,
      };
    }),

  isCardFlipped: false,
  setIsCardFlipped: (flag) =>
    set(() => {
      // console.log('setting isCardFlipped', flag);
      return {
        isCardFlipped: flag,
      };
    }),

  title: '',
  setTitle: (newTitle) =>
    set(() => ({
        title: newTitle,
    })),

  subtitle: '',
  setSubtitle: (newSubtitle) =>
    set(() => ({
        subtitle: newSubtitle,
    })),

  // sentence: '',
  // setSentence: (newSentence) =>
  //   set(() => ({
  //       sentence: newSentence,
  //   })),

  lang: 'pl-PL',
  setLang: (newLang) =>
    set(() => ({
        lang: newLang,
    })),

  //used in word guessing:
  result: false,
  setResult: (flag) =>
    set(() => {
      // console.log('setting result', flag);
      return {
        result: flag,
      };
    }),
   
   guess: '',
   setGuess: (newGuess) =>
    set(() => ({
        guess: newGuess,
    })),
}))