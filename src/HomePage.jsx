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

import { useEffect } from 'react';
import { emptyWord } from './utils.js';


function HomePage() {
  const setWordsToDo = wordsToDoState((state) => state.setWordsToDo)

  const currentPage = currentPageState((state) => state.currentPage)
  const setCurrentPage = currentPageState((state) => state.setCurrentPage)

  const isLoaded = isLoadedState((state) => state.isLoaded)
  const setIsLoaded = isLoadedState((state) => state.setIsLoaded)

  const isExerciseFinished = isExerciseFinishedState((state) => state.isExerciseFinished)
  const setIsExerciseFinished = isExerciseFinishedState((state) => state.setIsExerciseFinished)

  const setCurrentCard = currentCardState((state) => state.setCurrentCard)

  const userName = userState((state) => state.userName)

  useEffect(() => {
    const getWords = () => {
      let azure_url = ''
      const today = dayjs()
      let todayDateString = today.format('YYYY-MM-DD').toString()
      // todayDateString = '2024-04-07'
      if (userName.toLowerCase() === 'roland') {
        azure_url = 'https://flashcardsfunction.azurewebsites.net/api/wordsOnRolDate/' + todayDateString
      } else if (userName.toLowerCase() === 'ola') {
        azure_url = 'https://flashcardsfunction.azurewebsites.net/api/wordsOnOlaDate/' + todayDateString
      } else {
        azure_url = 'https://flashcardsfunction.azurewebsites.net/api/words'
      }
      axios.get(azure_url)
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
          setIsLoaded(true)
          setIsExerciseFinished(false)
        })
        .catch(err => {
          console.log('Error: ' + err);
        });
    }

    setCurrentCard(emptyWord)
    getWords();
  }, [isExerciseFinished, userName, setCurrentCard, setIsExerciseFinished, setIsLoaded, setWordsToDo]);

  const handleSummaryBackClick = () => {
    setIsExerciseFinished(true)
    setIsLoaded(false)
    setCurrentPage('homePage')
  }

  const handleLearnClick = () => {
    //work around
    //to add api to return X (as a api parameter) words with empty date
    setIsLoaded(false)
    let azure_url = ''
    if (userName.toLowerCase() === 'roland') {
      azure_url = 'https://flashcardsfunction.azurewebsites.net/api/newWordsOnRolDate'
    } else if (userName.toLowerCase() === 'ola') {
      azure_url = 'https://flashcardsfunction.azurewebsites.net/api/newWordsOnOlaDate'
    }

    axios.get(azure_url)
      .then(res => {
        setWordsToDo(res.data)
        setIsLoaded(true)
        setIsExerciseFinished(false)
        setCurrentPage('flashCard')
        console.log('Words are loaded!')
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
        return <ExercisePage />
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
