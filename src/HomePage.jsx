import axios from 'axios'
import dayjs from 'dayjs';

import WelcomePage from "./WelcomePage";
import ExercisePage from './ExercisePage.jsx';
import SummaryPage from './SummaryPage';
import LoadingPage from './LoadingPage';

import { wordsToDoState } from './states/wordsToDo.js';
import { currentPageState } from './states/currentPage.js';
import { isLoadedState } from './states/isLoaded.js';
import { isExerciseFinishedState} from './states/isExerciseFinished.js'
import { userState } from './states/user';
import { currentCardState } from './states/currentCard.js';
import { settings } from './states/settings.js';

import { useEffect } from 'react';
import { emptyWord } from './utils.js';

import { fetchAndCacheAudio } from './fetchAndCacheAudio.js'


function HomePage() {
  const setWordsToDo = wordsToDoState((state) => state.setWordsToDo)

  const currentPage = currentPageState((state) => state.currentPage)
  const setCurrentPage = currentPageState((state) => state.setCurrentPage)

  const isLoaded = isLoadedState((state) => state.isLoaded)
  const setIsLoaded = isLoadedState((state) => state.setIsLoaded)

  // const isExerciseFinished = isExerciseFinishedState((state) => state.isExerciseFinished)
  const setIsExerciseFinished = isExerciseFinishedState((state) => state.setIsExerciseFinished)

  const setCurrentCard = currentCardState((state) => state.setCurrentCard)

  const userName = userState((state) => state.userName)

  const lang = settings((state) => state.secondaryLanguage)
  const numberOfNewWords = settings((state) => state.numberOfNewWords)
  
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const doCaching = async (cards) => {
    for (const card of cards) {
      try {
        await fetchAndCacheAudio(card.pl, 'pl-PL');
        await fetchAndCacheAudio(card[lang.slice(0, 2)], lang);
        await sleep(200);
      } catch (err) {
        console.error(`Błąd podczas cache’owania karty:`, card.id, card.pl, card[lang.slice(0, 2)], err);
      }
    }
    // console.log("Caching finished");
    setIsLoaded(true);
  };

  const getWords = async () => {
    // console.log("get words")
    const today = dayjs()
    const azure_url = "https://flashcardsfunction.azurewebsites.net/api/getWordsOnDate/"
    const req_body = {
      userName: userName.toLowerCase(),
      lang: lang,
      date: today.format('YYYY-MM-DD').toString()
    }
    axios.post(azure_url, req_body)
      .then(res => {
        let unshuffled = res.data
        let shuffled = unshuffled
          //map to get random sort value for every element in array
          .map(value => ({ value, sort: Math.random() }))
          //sort base on created sort value
          .sort((a, b) => a.sort - b.sort)
          //unmap to get array
          .map(({ value }) => value)
        setWordsToDo(shuffled)

        //cachowanie slow
        doCaching(shuffled)
        setIsExerciseFinished(false)
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  }

  useEffect(() => {
    setCurrentCard(emptyWord)
    getWords();
  }, [userName, lang]);

  const handleSummaryBackClick = () => {
    // console.log('back click')
    setIsExerciseFinished(true)
    setIsLoaded(false)
    getWords();
    setCurrentPage('homePage')
  }

  const handleLearnClick = () => {
    setIsLoaded(false)
    const req_body = {
      userName: userName.toLowerCase(),
      lang: lang,
      number: numberOfNewWords[lang]
    }
    // console.log(req_body)
    const azure_url = "https://flashcardsfunction.azurewebsites.net/api/getNewWords/"

    axios.post(azure_url, req_body)
      .then(res => {
        setWordsToDo(res.data)
        //cachowanie slow
        doCaching(res.data)
        setIsExerciseFinished(false)
        setCurrentPage('flashCard')
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  }

  const homePagePageSelector = () => {
    if (isLoaded) {
      if (currentPage === 'homePage' || currentPage == null)
        return <WelcomePage 
          handleLearnClick={handleLearnClick}
        />
      if (currentPage === 'flashCard' || currentPage === 'wordGuessing')
        return <ExercisePage getWords={getWords} />
      if (currentPage === 'exerciseSummary')
        return <SummaryPage handleSummaryBackClick={handleSummaryBackClick} />
    } else {
      return <LoadingPage />
    }

  }

  return (
    homePagePageSelector()
  );
}

export default HomePage;
