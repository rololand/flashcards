import { Button } from "primereact/button";

function WelcomePage(props) {
   
  const buttons = () => {
    if (props.wordsToDoCount > 0)
      return <div className="flex flex-wrap align-items-center justify-content-center ">
          <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
            <Button label="Exercise! (flashcards)" onClick={props.handleExerciseFlashCardClick} />
          </div>
          <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
            <Button label="Exercise! (word guessing)" onClick={props.handleExerciseWordGuessing} />
          </div>
        </div>
    return <Button label="Learn new word" onClick={props.handleLearnClick} />
  }

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <div className="flex flex-column">
        <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
          <p className="m-0 text-primary" >Welcome {props.userName}!</p>
        </div>
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          <p className="m-0 text-color-secondary" >You have {props.wordsToDoCount} words to practice!</p>
        </div>
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          {buttons()}
        </div>
      </div>
    </div>

  );
}

export default WelcomePage;
