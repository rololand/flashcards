import dayjs from 'dayjs';

 export const emptyWord = {
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

export const getNewDate = (rank) => {
    const today = dayjs()
    let newDay;

    if (rank === 0 || rank === null) {
        newDay = today.add(1, 'day')
    } else if (rank === 1) {
        newDay = today.add(1, 'day')
    } else if (rank === 2) {
        newDay = today.add(2, 'day')
    } else if (rank === 3) {
        newDay = today.add(3, 'day')
    } else if (rank === 4) {
        newDay = today.add(7, 'day')
    } else if (rank === 5) {
        newDay = today.add(14, 'day')
    } else if (rank === 6) {
        newDay = today.add(21, 'day')
    } else if (rank === 7) {
        newDay = today.add(30, 'day')
    } else if (rank === 8) {
        newDay = today.add(45, 'day')
    } else if (rank === 9) {
        newDay = today.add(60, 'day')
    } else if (rank === 10) {
        newDay = today.add(90, 'day')
    }
    return newDay.format('YYYY-MM-DD').toString()
}

export const increaseRank = (rank) => {
    if (rank >= 10)
        return 10
    return rank + 1
}

export const decreaseRank = (rank) => {
    if (rank <= 0)
        return 0
    return rank - 1
}

export const getColouredTitleCard = (title) => {
    const prefix = title.substring(0, 4)
    if (prefix === 'der ') {
        return <span className="text-green-500">{title}</span>
    } else if (prefix === 'die ') {
        return <span className="text-pink-500">{title}</span>
    } else if (prefix === 'das ') {
        return <span className="text-orange-500">{title}</span>
    }
    return <span>{title}</span>
}

export const replaceSpecialCharacters = (word) => {
    return word
        .toLowerCase()
        .replaceAll('ä', 'a')
        .replaceAll('ö', 'o')
        .replaceAll('ü', 'u')
        .replaceAll('ß', 'ss')
}

export const compareWords = (guess, word, hint) => {
    guess = replaceSpecialCharacters(guess)
    word = replaceSpecialCharacters(word)

    let words = hint.split(",").map(word => replaceSpecialCharacters(word.trim()));
    words.push(word)
    // console.log('guess: ', guess)
    // console.log('word: ', word)
    // console.log('words: ', words)
    // console.log('result: ', words.includes(guess))
    return words.includes(guess)
}