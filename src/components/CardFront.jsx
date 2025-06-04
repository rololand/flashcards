import CardFrontFlashCard from './CardFrontFlashCard.jsx';
import CardFrontWordGuessing from './CardFrontWordGuessing.jsx';

import { currentPageState } from '../states/currentPage.js';

function CardFront() {
  const currentPage = currentPageState((state) => state.currentPage)

  const frontCardDisplayer = () => {
    if (currentPage === 'flashCard') {
        return <CardFrontFlashCard />
    }
    if (currentPage === 'wordGuessing') {
        return <CardFrontWordGuessing />
    }
  }

  return (
    frontCardDisplayer()
  );
}

export default CardFront;