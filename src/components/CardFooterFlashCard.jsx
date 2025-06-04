import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';

import { currentCardState } from '../states/currentCard';
import { wordsToDoState } from '../states/wordsToDo.js';

function CardFooterFlashCard() {
  const setIsCurrentFront = currentCardState((state) => state.setIsCurrentFront)
  const isCurrentFront = currentCardState((state) => state.isCurrentFront)
  const isCardFlipped = currentCardState((state) => state.isCardFlipped)
  const setIsCardFlipped = currentCardState((state) => state.setIsCardFlipped)

  const handleNokClick = wordsToDoState((state) => state.handleNokClick);
  const handleOkClick = wordsToDoState((state) => state.handleOkClick);

  const nokButton = () => {
    if (isCardFlipped) {
      return <Button label="NOK" onClick={handleNokClick} />
    } else {
      return <Button label="NOK" onClick={handleNokClick} disabled />
    }
  }

  const handleFlipClick = () => {
    setIsCardFlipped(true)
    setIsCurrentFront(!isCurrentFront)
  }

  const flipButton = () => {
    return <Button label="FLIP" onClick={handleFlipClick}/>
  }

  const okButton = () => {
    if (isCardFlipped) {
      return <Button label="OK" onClick={handleOkClick} />
    } else {
      return <Button label="OK" onClick={handleOkClick} disabled />
    }
  }

  return (
    <Toolbar start={nokButton} center={flipButton} end={okButton} className="bg-gray-900 shadow-2" />
  );
}

export default CardFooterFlashCard;