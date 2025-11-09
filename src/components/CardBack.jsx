import CardBackFlashCard from './CardBackFlashCard.jsx';
import CardBackWordGuessing from './CardBackWordGuessing.jsx';

import { currentPageState } from '../states/currentPage.js';

function CardBack() {
  const currentExercisePage = currentPageState((state) => state.currentExercisePage)

  const frontCardDisplayer = () => {
    if (currentExercisePage === 'flashCard') {
        return <CardBackFlashCard />
    }
    if (currentExercisePage === 'wordGuessing') {
        return <CardBackWordGuessing />
    }
  }

  return (
    frontCardDisplayer()
  );
}

export default CardBack;