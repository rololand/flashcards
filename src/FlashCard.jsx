import axios from 'axios'

import { Card } from "primereact/card"
import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
import { InputSwitch } from 'primereact/inputswitch';

import { useEffect, useState, useRef } from 'react';

function FlashCard(props) {
    const emptyWord = {
        "id": '',
        "pl": '',
        "de": '',
        "it": '',
        "es": '',
        "sentence_pl": '',
        "sentence_de": '',
        "sentence_it": '',
        "sentence_es": '',
        "date_ola": '',
        "date_rol": '',
        "hint_pl": '',
        "hint_de": '',
        "hint_it": '',
        "hint_es": '',
        "rank_ola": '',
        "rank_rol": ''
    }
    const todayDate = new Date()

    const [wordsToDo, setWordsToDo] = useState(props.wordsToDo)
    const [currentCard, setCurrentCard] = useState(wordsToDo[0])
    

    const [isCurrentFront, setIsCurrentFront] = useState(true)
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [sentence, setSentence] = useState('')
    const [lang, setLang] = useState('pl-PL')
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [isPolishMuted, setIsPolishMuted] = useState(false)
    const speech = new SpeechSynthesisUtterance()
    
    useEffect(() => {
        setCurrentCard(wordsToDo[currentWordIndex])
    }, [wordsToDo, currentWordIndex])

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

    useEffect(() => {
        speech.text = title
        speech.lang = lang
        if (lang==='pl-PL') {
            if (isPolishMuted===false && isMuted===false) {
                window.speechSynthesis.speak(speech)
            }
            
        } else if (lang==='de-DE'){
            if ((isMuted===false) ) {
                window.speechSynthesis.speak(speech)
            }
        }
    }, [title])

    const calculateNewDate = (rank) => {
        const year = todayDate.getFullYear()
        const month = todayDate.getMonth() + 1
        let day = todayDate.getDate()

        if (rank >= 0) {
            day = day + 1
        }

        return year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0')
    }

    const increaseRank = (rank) => {
        if (rank >= 10)
            return 10
        return rank + 1
    }

    const decreaseRank = (rank) => {
        if (rank <= 0)
            return 0
        return rank - 1
    }

    const handleNokClick = () => {
        let newCurrentCard = {...currentCard}
        let rank = 0
        if (props.userName == 'Roland') {
            rank = newCurrentCard.rank_rol
        } else if (props.userName == 'Ola') {
            rank = newCurrentCard.rank_ola
        }
        if (props.userName == 'Roland') {
            newCurrentCard.rank_rol = decreaseRank(rank)
        } else if (props.userName == 'Ola') {
            newCurrentCard.rank_ola = decreaseRank(rank)
        }
        let nextIndex = currentWordIndex + 1

        if (nextIndex === wordsToDo.length) {
            nextIndex = 0
        }

        setCurrentWordIndex(nextIndex)
    }

    const handleOkClick = () => {
        // update date
        let newCurrentCard = {...currentCard}
        let rank = 0
        if (props.userName == 'Roland') {
            rank = newCurrentCard.rank_rol
        } else if (props.userName == 'Ola') {
            rank = newCurrentCard.rank_ola
        }
        if (props.userName == 'Roland') {
            newCurrentCard.date_rol = calculateNewDate(rank)
            newCurrentCard.rank_rol = increaseRank(rank)
        } else if (props.userName == 'Ola') {
            newCurrentCard.date_ola = calculateNewDate(rank)
            newCurrentCard.rank_ola = increaseRank(rank)
        }

        // update sql
        const azure_url = 'https://flashcardsfunction.azurewebsites.net/api/words'
        axios.put(azure_url, newCurrentCard)
        .then(res => {
            console.log('Word card updated!')
            // remove from the list
            let newWordsToDo = [...wordsToDo]
            newWordsToDo.splice(currentWordIndex, 1)

            // update list and set done flag if needed
            if (newWordsToDo.length == 0) {
                console.log('dispaly summary')
                props.displayExerciseSummary()
                setCurrentCard(emptyWord)
            } else {
                if (currentWordIndex+1 === wordsToDo.length) {
                    setCurrentWordIndex(0)
                }
            setWordsToDo(newWordsToDo)
            
          }
        })
        .catch(err => {
          console.log('Error: ' + err);
        });

        
    }

    const MuteSwitch = () => {
        return (
            <div className="flex align-items-center gap-2">
                <InputSwitch checked={isMuted} onChange={(e) => setIsMuted(e.value)} />
                <span className="font-bold text-bluegray-50">mute</span>
            </div>
        )
    }
    const MutePolishSwitch = () => {
        return (
            <div className="flex align-items-center gap-2">
                <span className="font-bold text-bluegray-50">mute polish</span>
                <InputSwitch checked={isPolishMuted} onChange={(e) => setIsPolishMuted(e.value)} />
            </div>
        )
    }

    const header = () => {
        return <Toolbar start={MuteSwitch} end={MutePolishSwitch} className="bg-gray-900 shadow-2" />
    }

    const nokButton = () => {
        return <Button label="NOK" onClick={handleNokClick} />
    }

    const flipButton = () => {
        return <Button label="FLIP" onClick={() => {setIsCurrentFront(!isCurrentFront)}}/>
    }

    const okButton = () => {
        return <Button label="OK" onClick={handleOkClick} />
    }

    const footer = () => {
        return <Toolbar start={nokButton} center={flipButton} end={okButton} className="bg-gray-900 shadow-2" />
    }

    const titleCard = () => {
        const prefix = title.substring(0, 4)
        if (prefix == 'der ') {
            return <div className="text-green-500">{title}</div>
        } else if (prefix == 'die ') {
            return <div className="text-pink-500">{title}</div>
        } else if (prefix == 'das ') {
            return <div className="text-orange-500">{title}</div>
        }
        return title
    }

    return (
        <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
            <Card title={titleCard} subTitle={subtitle} footer={footer} header={header} className="md:w-25rem">
                <p className="m-0">
                    {sentence}
                </p>
            </Card>
        </div>
    );
  }
  
  export default FlashCard;
  