import axios from 'axios';
import TextToSpeechEffect from './TextToSpeechEffect';

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
import { useEventListener } from 'primereact/hooks';
import { MuteSwitch } from './components/MuteSwitch.jsx';

import { getNewDate, emptyWord, increaseRank, decreaseRank, getColouredTitleCard } from './utils.js'

import { settings } from './states/settings.js';
import { wordsToDoState } from './states/wordsToDo.js';
import { userState } from './states/user';
import { currentCardState } from './states/currentCard.js';

import { useEffect } from 'react';

function FlashCard(props) {
    const isMuted = settings((state) => state.isMuted)

    const wordsToDo = wordsToDoState((state) => state.wordsToDo)
    const setWordsToDo = wordsToDoState((state) => state.setWordsToDo)

    const userName = userState((state) => state.userName)

    const currentCard = currentCardState((state) => state.currentCard)
    const setCurrentCard = currentCardState((state) => state.setCurrentCard)

    const isCurrentFront = currentCardState((state) => state.isCurrentFront)
    const setIsCurrentFront = currentCardState((state) => state.setIsCurrentFront)

    const isCardFlipped = currentCardState((state) => state.isCardFlipped)
    const setIsCardFlipped = currentCardState((state) => state.setIsCardFlipped)

    const title = currentCardState((state) => state.title)
    const setTitle = currentCardState((state) => state.setTitle)

    const subtitle = currentCardState((state) => state.subtitle)
    const setSubtitle = currentCardState((state) => state.setSubtitle)

    const sentence = currentCardState((state) => state.sentence)
    const setSentence = currentCardState((state) => state.setSentence)

    const lang = currentCardState((state) => state.lang)
    const setLang = currentCardState((state) => state.setLang)
    
    const onKeyDown = (e) => {
        if (e.code === 'ArrowUp') {
            handleFlipClick()
        } else if (e.code === 'ArrowDown') {
            handleFlipClick()
        } else if (e.code === 'ArrowLeft') {
            handleNokClick()
        } else if (e.code === 'ArrowRight') {
            handleOkClick()
        } else if (e.code === 'Escape') {
            props.handleBackClick()
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
        setIsCurrentFront(true)
    }, [wordsToDo])

    useEffect(() => {
        if (isCurrentFront) {
            setTitle(currentCard.pl)
            setSubtitle(currentCard.hint_pl)
            setSentence(currentCard.sentence_pl)
            setLang('pl-PL')
        } else {
            setTitle(currentCard.de)
            setSubtitle(currentCard.hint_de)
            setSentence(currentCard.sentence_de)
            setLang('de-DE')
        }
    }, [isCurrentFront, currentCard])

    const handleFlipClick = () => {
        setIsCardFlipped(true)
        setIsCurrentFront(!isCurrentFront)
    }

    const handleNokClick = () => {
        // update rank
        let newCurrentCard = {...currentCard}
        let newWordsToDo = [...wordsToDo]
        let rank = 0
        if (userName === 'Roland') {
            rank = newCurrentCard.rank_rol
        } else if (userName === 'Ola') {
            rank = newCurrentCard.rank_ola
        }
        if (userName === 'Roland') {
            newCurrentCard.rank_rol = decreaseRank(rank)
        } else if (userName === 'Ola') {
            newCurrentCard.rank_ola = decreaseRank(rank)
        }
        // remove currentCard (index 0) from list toDo
        newWordsToDo = newWordsToDo.slice(1)
        // add newCurrentCard to list toDo
        newWordsToDo = [...newWordsToDo, newCurrentCard]
        // update wordToDo
        setWordsToDo(newWordsToDo)

    }

    const handleOkClick = () => {
        // update date and rank
        let newCurrentCard = {...currentCard}
        let newWordsToDo = [...wordsToDo]
        let rank = 0
        if (userName === 'Roland') {
            rank = newCurrentCard.rank_rol
        } else if (userName === 'Ola') {
            rank = newCurrentCard.rank_ola
        }
        if (userName === 'Roland') {
            newCurrentCard.date_rol = getNewDate(rank)
            newCurrentCard.rank_rol = increaseRank(rank)
        } else if (userName === 'Ola') {
            newCurrentCard.date_ola = getNewDate(rank)
            newCurrentCard.rank_ola = increaseRank(rank)
        }

        // update sql
        const azure_url = 'https://flashcardsfunction.azurewebsites.net/api/words'
        axios.put(azure_url, newCurrentCard)
        .then(res => {
            // remove from the list
            newWordsToDo = newWordsToDo.slice(1)
            // update list and set done flag if needed
            if (newWordsToDo.length === 0) {
                props.displayExerciseSummary()
                setCurrentCard(emptyWord)
            }
            setWordsToDo(newWordsToDo)
        })
        .catch(err => {
          console.log('Error: ' + err);
        });
    }

    const header = () => {
        return <Toolbar start={MuteSwitch} className="bg-gray-900 shadow-2" />
    }

    const nokButton = () => {
        if (isCardFlipped) {
            return <Button label="NOK" onClick={handleNokClick} />
        } else {
            return <Button label="NOK" onClick={handleNokClick} disabled />
        }
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

    const footer = () => {
        return <Toolbar start={nokButton} center={flipButton} end={okButton} className="bg-gray-900 shadow-2" />
    }

    return (
        <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
            <Card title={getColouredTitleCard(title)} subTitle={subtitle} footer={footer} header={header} className="md:w-25rem">
                <p className="m-0">
                    {sentence}
                </p>
            </Card>
            <TextToSpeechEffect title={title} lang={lang} isMuted={isMuted} />
        </div>
    );
  }
  
  export default FlashCard;
  