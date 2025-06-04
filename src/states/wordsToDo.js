import axios from 'axios';
import { create } from 'zustand'
import { emptyWord, increaseRank, decreaseRank, getNewDate } from '../utils'
import { userState } from './user'
import { currentCardState } from './currentCard'
import { currentPageState } from './currentPage'
import { useTTS } from './tts';

export const wordsToDoState = create((set, get) => ({
  wordsToDo: [emptyWord],
  wordsToDoCount: 0,

  setWordsToDo: (newWordsToDo) =>
    set(() => ({
      wordsToDo: newWordsToDo,
      wordsToDoCount: newWordsToDo.length,
    })),
  

  handleNokClick: () => {
    const { wordsToDo } = get();
    const setWordsToDo = get().setWordsToDo;
    const userName = userState.getState().userName;
    const clearTTS = useTTS.getState().clearQueue
    clearTTS()

    let newCurrentCard = {...wordsToDo[0]}
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
    
  },

  handleOkClick: () => {
    const { wordsToDo } = get();
    const setWordsToDo = get().setWordsToDo;
    const userName = userState.getState().userName;
    const setCurrentCard = currentCardState.getState().setCurrentCard
    const setCurrentPage = currentPageState.getState().setCurrentPage
    const clearTTS = useTTS.getState().clearQueue
    clearTTS()

    // update date and rank
    let newCurrentCard = {...wordsToDo[0]}
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
            setCurrentCard(emptyWord)
            setCurrentPage('exerciseSummary')
        }
        setWordsToDo(newWordsToDo)
    })
    .catch(err => {
      console.log('Error: ' + err);
    });
  },
}))