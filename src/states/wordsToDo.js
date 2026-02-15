import { create } from 'zustand'
import { emptyWord, increaseRank, decreaseRank, getNewDate } from '../utils/utils'
import { userState } from './user'
import { currentCardState } from './currentCard'
import { currentPageState } from './currentPage'
import { settings } from './settings';
import { useTTS } from './tts';
import apiRetry from "../utils/apiRetry"; // <- używamy retry

export const wordsToDoState = create((set, get) => ({
  wordsToDo: [emptyWord],
  totalWordsToDoCount: 0,
  wordsInExerciseCount: 0,
  correctAnswersCount: 0,
  guessesCount: 0,

  setWordsToDo: (newWordsToDo) =>
    set(() => {
      // console.log('New wordsToDo')
      return {
        wordsToDo: newWordsToDo,
      }
  }),
  setTotalWordsToDoCount: (count) =>
    set(() => {
      // console.log('New wordsToDo')
      return {
        totalWordsToDoCount: count,
      }
  }),
  clearExerciseCounts: (newWordsToDo) =>
    set(() => {
      // console.log('New wordsToDo')
      return {
        wordsInExerciseCount: newWordsToDo.length,
        correctAnswersCount: 0,
        guessesCount: 0,
      }
  }),
  increaseCorrectAnswersCount: () =>
    set((state) => {
      // console.log('New increaseCorrectAnswersCount ', state.correctAnswersCount + 1)
      return {
        correctAnswersCount: state.correctAnswersCount + 1,
      }
  }),
  increaseGuessesCount: () =>
    set((state) => {
      // console.log('New increaseGuessesCount ', state.guessesCount + 1)
      return {
        guessesCount: state.guessesCount + 1,
      }
  }),
  

  handleNokClick: () => {
    const increaseGuessesCount = get().increaseGuessesCount;
    increaseGuessesCount()

    const { wordsToDo } = get();
    const setWordsToDo = get().setWordsToDo;
    const lang = settings.getState().secondaryLanguage;
    const clearTTS = useTTS.getState().clearQueue;
    clearTTS()
    let newCurrentCard = {...wordsToDo[0]}
    let newWordsToDo = [...wordsToDo]
    let rank = 0

    // get proper rank
    if (lang === 'de-DE') rank = newCurrentCard.rank_de
    else if (lang === 'en-GB') rank = newCurrentCard.rank_en
    else if (lang === 'es-ES') rank = newCurrentCard.rank_es
    else if (lang === 'it-IT') rank = newCurrentCard.rank_it

    // update proper rank
    if (lang === 'de-DE') newCurrentCard.rank_de = decreaseRank(rank)
    else if (lang === 'en-GB') newCurrentCard.rank_en = decreaseRank(rank)
    else if (lang === 'es-ES') newCurrentCard.rank_es = decreaseRank(rank)
    else if (lang === 'it-IT') newCurrentCard.rank_it = decreaseRank(rank)

    // remove currentCard (index 0) from list toDo
    newWordsToDo = newWordsToDo.slice(1)
    // add newCurrentCard to list toDo
    newWordsToDo = [...newWordsToDo, newCurrentCard]
    // update wordToDo
    setWordsToDo(newWordsToDo)
  },

  handleOkClick: async () => {
    const increaseGuessesCount = get().increaseGuessesCount;
    increaseGuessesCount()

    const increaseCorrectAnswersCount = get().increaseCorrectAnswersCount;
    increaseCorrectAnswersCount()

    const { wordsToDo, wordsInExerciseCount, guessesCount } = get();

    const setWordsToDo = get().setWordsToDo;
    const userName = userState.getState().userName;
    const lang = settings.getState().secondaryLanguage;
    const maxRepetitionDays = settings.getState().maxRepetitionDays;
    const setCurrentCard = currentCardState.getState().setCurrentCard
    const setCurrentExercisePage = currentPageState.getState().setCurrentExercisePage
    const clearTTS = useTTS.getState().clearQueue
    clearTTS()

    // update date and rank
    let newCurrentCard = {...wordsToDo[0]}
    let newWordsToDo = [...wordsToDo]
    let rank = 0

    // get proper rank
    if (lang === 'de-DE') rank = newCurrentCard.rank_de
    else if (lang === 'en-GB') rank = newCurrentCard.rank_en
    else if (lang === 'es-ES') rank = newCurrentCard.rank_es
    else if (lang === 'it-IT') rank = newCurrentCard.rank_it

    // update proper rank and date
    let isFirstRound = guessesCount <= wordsInExerciseCount
    if (lang === 'de-DE') {
      newCurrentCard.date_de = getNewDate(rank, maxRepetitionDays[lang])
      newCurrentCard.rank_de = increaseRank(rank, isFirstRound)
    } else if (lang === 'en-GB') {
      newCurrentCard.date_en = getNewDate(rank, maxRepetitionDays[lang])
      newCurrentCard.rank_en = increaseRank(rank, isFirstRound)
    } else if (lang === 'es-ES') {
      newCurrentCard.date_es = getNewDate(rank, maxRepetitionDays[lang])
      newCurrentCard.rank_es = increaseRank(rank, isFirstRound)
    } else if (lang === 'it-IT') {
      newCurrentCard.date_it = getNewDate(rank, maxRepetitionDays[lang])
      newCurrentCard.rank_it = increaseRank(rank, isFirstRound)
    }

    // prepare SQL update
    const azure_url = '/api/updateWord/'
    const req_body = {
      userName: userName.toLowerCase(),
      word: newCurrentCard
    }

    // remove from list
    newWordsToDo = newWordsToDo.slice(1)
    if (newWordsToDo.length === 0) {
        setCurrentCard(emptyWord)
        setCurrentExercisePage('exerciseSummary')
    }
    setWordsToDo(newWordsToDo)

    // używamy apiRetry zamiast axios
    try {
      await apiRetry.post(azure_url, req_body)
    } catch (err) {
      console.error('Update word failed after retries:', err)
    }
  },
}))
