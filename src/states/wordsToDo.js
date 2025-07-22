import axios from 'axios';
import { create } from 'zustand'
import { emptyWord, increaseRank, decreaseRank, getNewDate } from '../utils'
import { userState } from './user'
import { currentCardState } from './currentCard'
import { currentPageState } from './currentPage'
import { settings } from './settings';
import { useTTS } from './tts';

export const wordsToDoState = create((set, get) => ({
  wordsToDo: [emptyWord],
  wordsToDoCount: 0,

  setWordsToDo: (newWordsToDo) =>
    set(() => {
      // console.log('New wordsToDo')
      return {
        wordsToDo: newWordsToDo,
        wordsToDoCount: newWordsToDo.length,
      }
    }),
  

  handleNokClick: () => {
    const { wordsToDo } = get();
    const setWordsToDo = get().setWordsToDo;
    const lang = settings.getState().secondaryLanguage;
    const clearTTS = useTTS.getState().clearQueue;
    clearTTS()

    let newCurrentCard = {...wordsToDo[0]}
    let newWordsToDo = [...wordsToDo]
    let rank = 0
    //get proper rank
    if (lang === 'de-DE') {
      rank = newCurrentCard.rank_de
    } else if (lang === 'en-GB') {
      rank = newCurrentCard.rank_en
    } else if (lang === 'es-ES') {
      rank = newCurrentCard.rank_es
    } else if (lang === 'it-IT') {
      rank = newCurrentCard.rank_it
    }

    //update proper rank
    if (lang === 'de-DE') {
      newCurrentCard.rank_de = decreaseRank(rank)
    } else if (lang === 'en-GB') {
      newCurrentCard.rank_en = decreaseRank(rank)
    } else if (lang === 'es-ES') {
      newCurrentCard.rank_es = decreaseRank(rank)
    } else if (lang === 'it-IT') {
      newCurrentCard.rank_it = decreaseRank(rank)
    }

    // remove currentCard (index 0) from list toDo
    newWordsToDo = newWordsToDo.slice(1)
    // add newCurrentCard to list toDo
    newWordsToDo = [...newWordsToDo, newCurrentCard]
    // update wordToDo
    setWordsToDo(newWordsToDo)
    
  },

  handleOkClick: () => {
    const { wordsToDo } = get();
    const setWordsToDo = get().setWordsToDo;
    const userName = userState.getState().userName;
    const lang = settings.getState().secondaryLanguage;
    const setCurrentCard = currentCardState.getState().setCurrentCard
    const setCurrentPage = currentPageState.getState().setCurrentPage
    const clearTTS = useTTS.getState().clearQueue
    clearTTS()

    // update date and rank
    let newCurrentCard = {...wordsToDo[0]}
    let newWordsToDo = [...wordsToDo]
    let rank = 0

    //get proper rank
    if (lang === 'de-DE') {
      rank = newCurrentCard.rank_de
    } else if (lang === 'en-GB') {
      rank = newCurrentCard.rank_en
    } else if (lang === 'es-ES') {
      rank = newCurrentCard.rank_es
    } else if (lang === 'it-IT') {
      rank = newCurrentCard.rank_it
    }

    //update proper rank
    if (lang === 'de-DE') {
      newCurrentCard.date_de = getNewDate(rank)
      newCurrentCard.rank_de = increaseRank(rank)
    } else if (lang === 'en-GB') {
      newCurrentCard.date_en = getNewDate(rank)
      newCurrentCard.rank_en = increaseRank(rank)
    } else if (lang === 'es-ES') {
      newCurrentCard.date_es = getNewDate(rank)
      newCurrentCard.rank_es = increaseRank(rank)
    } else if (lang === 'it-IT') {
      newCurrentCard.date_it = getNewDate(rank)
      newCurrentCard.rank_it = increaseRank(rank)
    }

    // update sql
    const azure_url = 'https://flashcardsfunction.azurewebsites.net/api/updateWord/'
    const req_body = {
      userName: userName.toLowerCase(),
      word: newCurrentCard
    }

    // remove from the list
    newWordsToDo = newWordsToDo.slice(1)
    // update list and set done flag if needed
    if (newWordsToDo.length === 0) {
        setCurrentCard(emptyWord)
        setCurrentPage('exerciseSummary')
    }
    setWordsToDo(newWordsToDo)

    axios.post(azure_url, req_body)
    .catch(err => {
      console.log('Error: ' + err);
    });
  },
}))