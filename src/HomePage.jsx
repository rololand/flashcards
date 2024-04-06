import axios from 'axios'

import WelcomePage from "./WelcomePage";
import FlashCard from "./FlashCard";
import SummaryPage from './SummaryPage';
import LoadingPage from './LoadingPage';

import { useEffect, useState, useRef } from 'react';

function HomePage() {
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
  const [wordsToDo, setWordsToDo] = useState([emptyWord])
  const [wordsToDoCount, setWordsToDoCount] = useState(0)
  const [userName, setUserName] = useState('Roland')
  const [currentPage, setCurrentPage] = useState('homePage')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const getWords = () => {
      let azure_url = ''
      const todayDate = new Date()
      const year = todayDate.getFullYear()
      const month = todayDate.getMonth() + 1
      const day = todayDate.getDate()
      let todayDateString = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0')
      // todayDateString = '2024-04-07'
      if (userName == 'Roland') {
        azure_url = 'https://flashcardsfunction.azurewebsites.net/api/wordsOnRolDate/' + todayDateString
      } else if (userName == 'Ola') {
        azure_url = 'https://flashcardsfunction.azurewebsites.net/api/wordsOnOlaDate/' + todayDateString
      } else {
        azure_url = 'https://flashcardsfunction.azurewebsites.net/api/words'
      }
      axios.get(azure_url)
        .then(res => {
          setWordsToDo(res.data)
          setWordsToDoCount(res.data.length)
          setIsLoaded(true)
          console.log('Words are loaded!')
        })
        .catch(err => {
          console.log('Error: ' + err);
        });
    }

    getWords();
  }, []);

  const handleExerciseFlashCardClick = () => {
    setCurrentPage('flashCard')
  }

  const handleLearnClick = () => {
    //work around
    //to add api to return X (as a api parameter) words with empty date
    const azure_url = 'https://flashcardsfunction.azurewebsites.net/api/words'
    axios.get(azure_url)
      .then(res => {
        console.log('Words are loaded!')
        console.log(res.data)
        for (let wordId in res.data) {
          let wordCard = res.data[wordId]
          console.log(wordCard)
          if (userName == 'Roland') {
            if (wordCard.date_rol == null) {
              console.log(wordCard)
              setWordsToDo([wordCard])
              setWordsToDoCount(1)
              break
            } else {
              continue
            }
          } else if (userName == 'Ola') {
            if (!wordCard.date_ola) {
              setWordsToDo([wordCard])
              setWordsToDoCount(1)
            } else {
              break
            }
          }
        }
      })
      .catch(err => {
        console.log('Error: ' + err);
      });

    console.log('learn')
  }

  const displayExerciseSummary = () => {
    setCurrentPage('exerciseSummary')
  }

  const homePagePageSelector = () => {
    if (isLoaded) {
      if (currentPage == 'homePage' || currentPage == null)
        return <WelcomePage 
          userName={userName} 
          wordsToDoCount={wordsToDoCount} 
          handleExerciseFlashCardClick={handleExerciseFlashCardClick}
          handleLearnClick={handleLearnClick}
        />
      if (currentPage == 'flashCard')
        return <FlashCard userName={userName} wordsToDo={wordsToDo} displayExerciseSummary={displayExerciseSummary} />
      if (currentPage == 'exerciseSummary')
        return <SummaryPage userName={userName} />
    } else {
      return <LoadingPage userName={userName} />
    }
      
    
  }

  return (
    homePagePageSelector()
  );
}

export default HomePage;
