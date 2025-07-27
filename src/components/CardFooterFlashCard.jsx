import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';

import { currentCardState } from '../states/currentCard';
import { wordsToDoState } from '../states/wordsToDo.js';
import { settings } from "../states/settings.js";

import uitxt from '../uitxt.json'

function CardFooterFlashCard() {
  const setIsCurrentFront = currentCardState((state) => state.setIsCurrentFront)
  const isCurrentFront = currentCardState((state) => state.isCurrentFront)
  const isCardFlipped = currentCardState((state) => state.isCardFlipped)
  const setIsCardFlipped = currentCardState((state) => state.setIsCardFlipped)

  const handleNokClick = wordsToDoState((state) => state.handleNokClick);
  const handleOkClick = wordsToDoState((state) => state.handleOkClick);

  const uiLang = settings((state) => state.uiLang)

  const nokButton = () => {
    if (isCardFlipped) {
      return <Button label={uitxt["14"][uiLang]} onClick={handleNokClick} />
    } else {
      return <Button label={uitxt["14"][uiLang]} onClick={handleNokClick} disabled />
    }
  }

  const handleFlipClick = () => {
    setIsCardFlipped(true)
    setIsCurrentFront(!isCurrentFront)
  }

  const flipButton = () => {
    return <Button label={uitxt["15"][uiLang]} onClick={handleFlipClick}/>
  }

  const okButton = () => {
    if (isCardFlipped) {
      return <Button label={uitxt["16"][uiLang]} onClick={handleOkClick} />
    } else {
      return <Button label={uitxt["16"][uiLang]} onClick={handleOkClick} disabled />
    }
  }

  return (
    <Toolbar start={nokButton} center={flipButton} end={okButton} className="bg-gray-900 shadow-2" />
  );
}

export default CardFooterFlashCard;