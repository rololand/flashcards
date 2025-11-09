import CardFrontFlashCard from './CardFrontFlashCard.jsx';
import CardFrontWordGuessing from './CardFrontWordGuessing.jsx';

import { currentPageState } from '../states/currentPage.js';

function CardFront() {
  const currentExercisePage = currentPageState((state) => state.currentExercisePage)

  const frontCardDisplayer = () => {
    if (currentExercisePage === 'flashCard') {
        return <CardFrontFlashCard />
    }
    if (currentExercisePage === 'wordGuessing') {
        return <CardFrontWordGuessing />
    }
  }

  return (
    frontCardDisplayer()
  );
}

export default CardFront;