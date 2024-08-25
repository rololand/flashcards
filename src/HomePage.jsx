import axios from 'axios'
import dayjs from 'dayjs';

import WelcomePage from "./WelcomePage";
import FlashCard from "./FlashCard";
import WordGuessing from './WordGuessing';
import SummaryPage from './SummaryPage';
import LoadingPage from './LoadingPage';

import { useEffect, useState } from 'react';

function HomePage(props) {
  const emptyWord = {
    "id": '',
    "en": '',
    "pl": '',
    "de": '',
    "it": '',
    "es": '',
    "sentence_pl": '',
    "sentence_en": '',
    "sentence_de": '',
    "sentence_it": '',
    "sentence_es": '',
    "date_ola": '',
    "date_rol": '',
    "hint_pl": '',
    "hint_de": '',
    "hint_en": '',
    "hint_it": '',
    "hint_es": '',
    "rank_ola": '',
    "rank_rol": ''
  }
  const [wordsToDo, setWordsToDo] = useState([emptyWord])
  const [wordsToDoCount, setWordsToDoCount] = useState(0)
  const [currentPage, setCurrentPage] = useState('homePage')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isExerciseFinished, setIsExerciseFinished] = useState(false)

  const userName = props.userName

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
          setWordsToDoCount(res.data.length)
          setIsLoaded(true)
          setIsExerciseFinished(false)
        })
        .catch(err => {
          console.log('Error: ' + err);
        });
    }

    getWords();
  }, [isExerciseFinished]);

  const handleExerciseFlashCardClick = () => {
    setCurrentPage('flashCard')
  }

  const handleExerciseWordGuessing = () => {
    setCurrentPage('wordGuessing')
  }

  const handleSummaryBackClick = () => {
    console.log('back')
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
        setWordsToDoCount(res.data.length)
        setIsLoaded(true)
        setIsExerciseFinished(false)
        console.log('Words are loaded!')
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  }

  const displayExerciseSummary = () => {
    setCurrentPage('exerciseSummary')
  }

  const homePagePageSelector = () => {
    if (isLoaded) {
      if (currentPage === 'homePage' || currentPage == null)
        return <WelcomePage 
          userName={userName}
          wordsToDoCount={wordsToDoCount}
          handleExerciseFlashCardClick={handleExerciseFlashCardClick}
          handleExerciseWordGuessing={handleExerciseWordGuessing}
          handleLearnClick={handleLearnClick}
        />
      if (currentPage === 'flashCard')
        return <FlashCard 
          userName={userName}
          wordsToDo={wordsToDo}
          displayExerciseSummary={displayExerciseSummary}
        />
      if (currentPage === 'wordGuessing')
        return <WordGuessing
          userName={userName}
          wordsToDo={wordsToDo}
          displayExerciseSummary={displayExerciseSummary}
        />
      if (currentPage === 'exerciseSummary')
        return <SummaryPage userName={userName} handleSummaryBackClick={handleSummaryBackClick} />
    } else {
      return <LoadingPage userName={userName} />
    }
      
    
  }

  return (
    homePagePageSelector()
  );
}

export default HomePage;
