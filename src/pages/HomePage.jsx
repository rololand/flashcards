import dayjs from 'dayjs';

import WelcomePage from "./WelcomePage.jsx";
import ExercisePage from './ExercisePage.jsx';
import SummaryPage from './SummaryPage.jsx';
import IrregularVerbs from '../exercises/IrregularVerbs.jsx';
import Conjunctions from '../exercises/Conjunctions.jsx';
import LoadingPage from './LoadingPage.jsx';

import { wordsToDoState } from '../states/wordsToDo.js';
import { currentPageState } from '../states/currentPage.js';
import { isLoadedState } from '../states/isLoaded.js';
import { isExerciseFinishedState } from '../states/isExerciseFinished.js';
import { userState } from '../states/user.js';
import { currentCardState } from '../states/currentCard.js';
import { settings } from '../states/settings.js';

import { useEffect } from 'react';
import { emptyWord } from '../utils/utils.js';

import { fetchAndCacheAudio } from '../utils/fetchAndCacheAudio.js';
import apiRetry from "../utils/apiRetry";

function HomePage() {
  const setWordsToDo = wordsToDoState((state) => state.setWordsToDo);
  const setTotalWordsToDoCount = wordsToDoState((state) => state.setTotalWordsToDoCount);

  const currentPage = currentPageState((state) => state.currentPage);
  const setCurrentPage = currentPageState((state) => state.setCurrentPage);
  const currentExercisePage = currentPageState((state) => state.currentExercisePage);
  const setCurrentExercisePage = currentPageState((state) => state.setCurrentExercisePage);

  const isLoaded = isLoadedState((state) => state.isLoaded);
  const setIsLoaded = isLoadedState((state) => state.setIsLoaded);

  const setIsExerciseFinished = isExerciseFinishedState((state) => state.setIsExerciseFinished);

  const setCurrentCard = currentCardState((state) => state.setCurrentCard);

  const userName = userState((state) => state.userName);

  const lang = settings((state) => state.secondaryLanguage);
  const numberOfNewWords = settings((state) => state.numberOfNewWords);
  const numberOfWordsToRepeat = settings((state) => state.numberOfWordsToRepeat);

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
    setIsLoaded(true);
  };

  const getWords = async () => {
    setIsLoaded(false);
    const today = dayjs();
    const azure_url = "/api/getWordsOnDate/"; // baseURL w apiRetry
    const req_body = {
      userName: userName.toLowerCase(),
      lang: lang,
      date: today.format('YYYY-MM-DD').toString()
    };
    try {
      const res = await apiRetry.post(azure_url, req_body);
      const unshuffled = res.data;
      setTotalWordsToDoCount(unshuffled.length);

      const count = numberOfWordsToRepeat[lang];
      const shuffled = unshuffled.sort(() => Math.random() - 0.5).slice(0, count);
      setWordsToDo(shuffled);

      // caching
      doCaching(shuffled);
      setIsExerciseFinished(false);
    } catch (err) {
      console.error('Error fetching words:', err);
    }
  };

  useEffect(() => {
    setCurrentCard(emptyWord);
    setWordsToDo([emptyWord]);
    getWords();
  }, [userName, lang, currentPage]);

  const handleSummaryBackClick = () => {
    setCurrentCard(emptyWord);
    setIsExerciseFinished(true);
    setIsLoaded(false);
    getWords();
    setCurrentExercisePage('welcomePage');
  };

  const handleLearnClick = async () => {
    setIsLoaded(false);
    const req_body = {
      userName: userName.toLowerCase(),
      lang: lang,
      number: numberOfNewWords[lang]
    };
    const azure_url = "/api/getNewWords/";

    try {
      const res = await apiRetry.post(azure_url, req_body);
      if (res.data.length > 0) {
        setWordsToDo(res.data);
        // caching
        doCaching(res.data);
        setIsExerciseFinished(false);
        setCurrentExercisePage('flashCard');
      } else {
        setIsLoaded(true);
      }
    } catch (err) {
      console.error('Error fetching new words:', err);
    }
  };

  const homePagePageSelector = () => {
    if (isLoaded) {
      if (currentExercisePage === 'welcomePage' || currentExercisePage == null)
        return <WelcomePage handleLearnClick={handleLearnClick} />;
      if (currentExercisePage === 'flashCard' || currentExercisePage === 'wordGuessing')
        return <ExercisePage getWords={getWords} handleSummaryBackClick={handleSummaryBackClick} />;
      if (currentExercisePage === 'exerciseSummary')
        return <SummaryPage handleSummaryBackClick={handleSummaryBackClick} />;
      if (currentExercisePage === 'irregularVerbs')
        return <IrregularVerbs handleSummaryBackClick={handleSummaryBackClick} />;
      if (currentExercisePage === 'conjunctions')
        return <Conjunctions handleSummaryBackClick={handleSummaryBackClick} />;
    } else {
      return <LoadingPage />;
    }
  };

  return homePagePageSelector();
}

export default HomePage;
