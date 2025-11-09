import CardFooterFlashCard from './CardFooterFlashCard.jsx';

import { currentPageState } from '../states/currentPage.js';

function CardFooter() {

  const currentExercisePage = currentPageState((state) => state.currentExercisePage)

  const cardFooterDisplayer = () => {
    if (currentExercisePage === 'flashCard') {
      return <CardFooterFlashCard />
    }
  }

  return (
    cardFooterDisplayer()
  );
}

export default CardFooter;