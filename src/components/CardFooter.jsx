import CardFooterFlashCard from './CardFooterFlashCard.jsx';

import { currentPageState } from '../states/currentPage.js';

function CardFooter() {

  const currentPage = currentPageState((state) => state.currentPage)

  const cardFooterDisplayer = () => {
    if (currentPage === 'flashCard') {
      return <CardFooterFlashCard />
    }
  }

  return (
    cardFooterDisplayer()
  );
}

export default CardFooter;