import { useEventListener } from 'primereact/hooks';
import { useEffect } from 'react';

import CardFront from './components/CardFront.jsx';
import CardBack from './components/CardBack.jsx';

import { wordsToDoState } from './states/wordsToDo.js';
import { currentPageState } from './states/currentPage.js';
import { isLoadedState } from './states/isLoaded.js';
import { isExerciseFinishedState} from './states/isExerciseFinished.js';
import { currentCardState } from './states/currentCard.js';

function ExercisePage(props) {
  const wordsToDo = wordsToDoState((state) => state.wordsToDo)
  const handleNokClick = wordsToDoState((state) => state.handleNokClick);
  const handleOkClick = wordsToDoState((state) => state.handleOkClick);
  
  const setCurrentPage = currentPageState((state) => state.setCurrentPage)
  const setIsLoaded = isLoadedState((state) => state.setIsLoaded)
  const setIsExerciseFinished = isExerciseFinishedState((state) => state.setIsExerciseFinished)
  
  const setCurrentCard = currentCardState((state) => state.setCurrentCard)
  const isCurrentFront = currentCardState((state) => state.isCurrentFront)
  const setIsCurrentFront = currentCardState((state) => state.setIsCurrentFront)
  const isCardFlipped = currentCardState((state) => state.isCardFlipped)
  const setIsCardFlipped = currentCardState((state) => state.setIsCardFlipped)
  const setResult = currentCardState((state) => state.setResult)

  const onKeyDown = (e) => {
    if (e.code === 'Enter') {

    } else if (e.code === 'F1') {

    } else if (e.code === 'Escape') {
      setIsExerciseFinished(true)
      setIsLoaded(false)
      setIsCardFlipped(false)
      setIsCurrentFront(true)
      setCurrentPage('homePage')
      props.getWords();
    } else if (e.code === 'ArrowUp') {
      setIsCardFlipped(true)
      setIsCurrentFront(!isCurrentFront)
    } else if (e.code === 'ArrowDown') {
      setIsCardFlipped(true)
      setIsCurrentFront(!isCurrentFront)
    } else if (e.code === 'ArrowLeft' && isCardFlipped) {
      handleNokClick()
    } else if (e.code === 'ArrowRight' && isCardFlipped) {
      handleOkClick()
    }
  };

  const [bindKeyDown, unbindKeyDown] = useEventListener({
    type: 'keydown',
    listener: (e) => {
      onKeyDown(e);
    }
  });

  const [bindKeyUp, unbindKeyUp] = useEventListener({
    type: 'keyup',
      listener: (e) => {
    }
  });

  useEffect(() => {
    bindKeyDown();
    bindKeyUp();

    return () => {
      unbindKeyDown();
      unbindKeyUp();
    };
  }, [bindKeyDown, bindKeyUp, unbindKeyDown, unbindKeyUp]);

  useEffect(() => {
    setCurrentCard(wordsToDo[0])
    setIsCardFlipped(false)
    setResult(false)
    setIsCurrentFront(true)
  }, [wordsToDo, setCurrentCard, setIsCardFlipped, setResult, setIsCurrentFront])

  const cardDisplayer = () => {
    if (isCurrentFront)
      return <CardFront />
    return <CardBack />
  }

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <div className="flex flex-column">
        {cardDisplayer()}
      </div>
    </div>
  );
}

export default ExercisePage;