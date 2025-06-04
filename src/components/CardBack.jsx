import CardBackFlashCard from './CardBackFlashCard.jsx';
import CardBackWordGuessing from './CardBackWordGuessing.jsx';

import { currentPageState } from '../states/currentPage.js';

function CardBack() {
  const currentPage = currentPageState((state) => state.currentPage)

  const frontCardDisplayer = () => {
    if (currentPage === 'flashCard') {
        return <CardBackFlashCard />
    }
    if (currentPage === 'wordGuessing') {
        return <CardBackWordGuessing />
    }
  }

  return (
    frontCardDisplayer()
  );
}

export default CardBack;