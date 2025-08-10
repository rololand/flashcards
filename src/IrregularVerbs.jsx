import { useState, useEffect, useRef } from 'react';
import { useEventListener } from 'primereact/hooks';

import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { settings } from "./states/settings.js";

import uitxt from './uitxt.json'

function IrregularVerbs(props) {
  const uiLang = settings((state) => state.uiLang)

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <div className="flex flex-column">
        {VerbTrainer()}
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          <Button label={uitxt["13"][uiLang]} onClick={props.handleSummaryBackClick} />
        </div>
      </div>
    </div>

  );
}

const VerbTrainer = () => {
  const uiLang = settings((state) => state.uiLang)
  
  const [currentVerb, setCurrentVerb] = useState(null);
  const [inputPraeteritum, setInputPraeteritum] = useState('');
  const [inputPartizip, setInputPartizip] = useState('');
  const prateritumRef = useRef(null);
  const partizipRef = useRef(null);

  const getRandomVerb = () => {
    const randomIndex = Math.floor(Math.random() * verbs.length);
    return verbs[randomIndex];
  };

  const handleNextVerb = () => {
    setCurrentVerb(getRandomVerb());
    setInputPraeteritum('');
    setInputPartizip('');
    prateritumRef.current?.focus();
  };

  const showAnswer = () => {
    setInputPraeteritum(currentVerb.prateritum.split(',')[0].trim());
    setInputPartizip(currentVerb.partizip_zwei.split(',')[0].trim());
  };

  const onKeyDown = (e) => {
    if (e.code === 'Tab') {
      e.preventDefault();
      if (e.target.name === 'prateritum') {
        partizipRef.current?.focus();
      } else if (e.target.name === 'partizip') {
        prateritumRef.current?.focus();
      } else {
        prateritumRef.current?.focus();
      }
    } else if (e.code === 'Enter') {
      handleNextVerb();
    } else if (e.code === 'Space') {
      e.preventDefault();
      showAnswer();
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

  const getInputStyle = (input, correct) => {
    if (!input) return {};
    const correctForms = correct
      .toLowerCase()
      .split(',')
      .map(f => f.trim());

    return correctForms.includes(input.trim().toLowerCase())
      ? { border: '2px solid #28a745' } // zielony
      : { border: '2px solid #dc3545' }; // czerwony
  };

  useEffect(() => {
    handleNextVerb();
  }, []);

  if (!currentVerb) return null;

  return (
    <div className="p-m-4" style={{ maxWidth: '400px' }}>
      <h3>{currentVerb.pl}: {currentVerb.de}</h3>

      <div className="p-field h-4rem">
        <label>Präteritum:</label>
        <InputText
          name="prateritum"
          ref={prateritumRef}
          value={inputPraeteritum}
          onChange={(e) => setInputPraeteritum(e.target.value)}
          style={getInputStyle(inputPraeteritum, currentVerb.prateritum)}
          autoComplete="off"
        />
      </div>

      <div className="p-field h-4rem">
        <label>Partizip II:</label>
        <InputText
          name="partizip"
          ref={partizipRef}
          value={inputPartizip}
          onChange={(e) => setInputPartizip(e.target.value)}
          style={getInputStyle(inputPartizip, currentVerb.partizip_zwei)}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-column p-3 gap-2 mt-3">
        <Button
          label={uitxt["24"][uiLang]}
          icon="pi pi-refresh"
          onClick={handleNextVerb}
          className="p-mr-2"
        />
        <Button
          label={uitxt["25"][uiLang]}
          icon="pi pi-eye"
          onClick={showAnswer}
          className="p-button-secondary"
        />
      </div>
    </div>
  );
};

const verbs = [
  {"pl":"oferować","de":"anbieten","prateritum":"bot an","partizip_zwei":"angeboten"},
  {"pl":"ubierać się","de":"anziehen","prateritum":"zog sich an","partizip_zwei":"sich angezogen"},
  {"pl":"zwracać uwagę","de":"auffallen","prateritum":"fiel auf","partizip_zwei":"aufgefallen"},
  {"pl":"piec","de":"backen","prateritum":"buk, backte","partizip_zwei":"gebacken"},
  {"pl":"rozkazać","de":"befehlen","prateritum":"befahl","partizip_zwei":"befohlen"},
  {"pl":"zaczynać","de":"beginnen","prateritum":"begann","partizip_zwei":"begonnen"},
  {"pl":"otrzymywać","de":"bekommen","prateritum":"bekam","partizip_zwei":"bekommen"},
  {"pl":"skręcać","de":"biegen","prateritum":"bog","partizip_zwei":"gebogen"},
  {"pl":"oferować","de":"bieten","prateritum":"bot","partizip_zwei":"geboten"},
  {"pl":"prosić","de":"bitten","prateritum":"bat","partizip_zwei":"gebeten"},
  {"pl":"pozostać","de":"bleiben","prateritum":"blieb","partizip_zwei":"geblieben"},
  {"pl":"piec/smażyć","de":"braten","prateritum":"briet","partizip_zwei":"gebraten"},
  {"pl":"łamać","de":"brechen","prateritum":"brach","partizip_zwei":"gebrochen"},
  {"pl":"palić się","de":"brennen","prateritum":"brannte","partizip_zwei":"gebrannt"},
  {"pl":"przynosić","de":"bringen","prateritum":"brachte","partizip_zwei":"gebracht"},
  {"pl":"myśleć","de":"denken","prateritum":"dachte","partizip_zwei":"gedacht"},
  {"pl":"móc (zezwolenie)","de":"dürfen","prateritum":"durfte","partizip_zwei":"gedurft"},
  {"pl":"polecić","de":"empfehlen","prateritum":"empfahl","partizip_zwei":"empfohlen"},
  {"pl":"odczuwać, doznać","de":"empfinden","prateritum":"empfand","partizip_zwei":"empfunden"},
  {"pl":"decydować","de":"entscheiden","prateritum":"entschied","partizip_zwei":"entschieden"},
  {"pl":"przerazić","de":"erschrecken","prateritum":"erschrak","partizip_zwei":"erschrocken"},
  {"pl":"jeść","de":"essen","prateritum":"aß","partizip_zwei":"gegessen"},
  {"pl":"jechać","de":"fahren","prateritum":"fuhr","partizip_zwei":"gefahren"},
  {"pl":"upadać","de":"fallen","prateritum":"fiel","partizip_zwei":"gefallen"},
  {"pl":"łapać","de":"fangen","prateritum":"fing","partizip_zwei":"gefangen"},
  {"pl":"znaleźć","de":"finden","prateritum":"fand","partizip_zwei":"gefunden"},
  {"pl":"latać","de":"fliegen","prateritum":"flog","partizip_zwei":"geflogen"},
  {"pl":"uciekać","de":"fliehen","prateritum":"floh","partizip_zwei":"geflohen"},
  {"pl":"płynąć","de":"fließen","prateritum":"floss","partizip_zwei":"geflossen"},
  {"pl":"żreć","de":"fressen","prateritum":"fraß","partizip_zwei":"gefressen"},
  {"pl":"marznąć","de":"frieren","prateritum":"fror","partizip_zwei":"gefroren"},
  {"pl":"rodzić","de":"gebaren","prateritum":"gebar","partizip_zwei":"geboren"},
  {"pl":"dawać","de":"geben","prateritum":"gab","partizip_zwei":"gegeben"},
  {"pl":"iść","de":"gehen","prateritum":"ging","partizip_zwei":"gegangen"},
  {"pl":"udać się","de":"gelingen","prateritum":"gelang","partizip_zwei":"gelungen"},
  {"pl":"obowiązywać","de":"gelten","prateritum":"galt","partizip_zwei":"gegolten"},
  {"pl":"rozkoszować się","de":"genießen","prateritum":"genoss","partizip_zwei":"genossen"},
  {"pl":"wydarzyć się","de":"geschehen","prateritum":"geschah","partizip_zwei":"geschehen"},
  {"pl":"wygrać","de":"gewinnen","prateritum":"gewann","partizip_zwei":"gewonnen"},
  {"pl":"podlewać","de":"gießen","prateritum":"goss","partizip_zwei":"gegossen"},
  {"pl":"sięgać","de":"greifen","prateritum":"griff","partizip_zwei":"gegriffen"},
  {"pl":"mieć","de":"haben","prateritum":"hatte","partizip_zwei":"gehabt"},
  {"pl":"trzymać","de":"halten","prateritum":"hielt","partizip_zwei":"gehalten"},
  {"pl":"wisieć","de":"hängen","prateritum":"hing","partizip_zwei":"gehangen"},
  {"pl":"podnosić","de":"heben","prateritum":"hob","partizip_zwei":"gehoben"},
  {"pl":"nazywać","de":"heißen","prateritum":"hieß","partizip_zwei":"geheißen"},
  {"pl":"pomagać","de":"helfen","prateritum":"half","partizip_zwei":"geholfen"},
  {"pl":"znać","de":"kennen","prateritum":"kannte","partizip_zwei":"gekannt"},
  {"pl":"brzmieć","de":"klingen","prateritum":"klang","partizip_zwei":"geklungen"},
  {"pl":"przychodzić","de":"kommen","prateritum":"kam","partizip_zwei":"gekommen"},
  {"pl":"móc (umiejętność)","de":"können","prateritum":"konnte","partizip_zwei":"gekonnt"},
  {"pl":"ładować, zapraszać","de":"laden","prateritum":"lud","partizip_zwei":"geladen"},
  {"pl":"pozwalać","de":"lassen","prateritum":"ließ","partizip_zwei":"gelassen"},
  {"pl":"biec","de":"laufen","prateritum":"lief","partizip_zwei":"gelaufen"},
  {"pl":"cierpieć","de":"leiden","prateritum":"litt","partizip_zwei":"gelitten"},
  {"pl":"pożyczać","de":"leihen","prateritum":"lieh","partizip_zwei":"geliehen"},
  {"pl":"czytać","de":"lesen","prateritum":"las","partizip_zwei":"gelesen"},
  {"pl":"leżeć","de":"liegen","prateritum":"lag","partizip_zwei":"gelegen"},
  {"pl":"kłamać","de":"lügen","prateritum":"log","partizip_zwei":"gelogen"},
  {"pl":"mierzyć","de":"messen","prateritum":"maß","partizip_zwei":"gemessen"},
  {"pl":"lubić","de":"mögen","prateritum":"mochte","partizip_zwei":"gemocht"},
  {"pl":"musieć","de":"müssen","prateritum":"musste","partizip_zwei":"gemusst"},
  {"pl":"rozmyślać","de":"nachdenken","prateritum":"dachte nach","partizip_zwei":"nachgedacht"},
  {"pl":"brać","de":"nehmen","prateritum":"nahm","partizip_zwei":"genommen"},
  {"pl":"nazywać","de":"nennen","prateritum":"nannte","partizip_zwei":"genannt"},
  {"pl":"gwizdać","de":"pfeifen","prateritum":"pfiff","partizip_zwei":"gepfiffen"},
  {"pl":"chwalić","de":"preisen","prateritum":"pries","partizip_zwei":"gepriesen"},
  {"pl":"tryskać","de":"quellen","prateritum":"quoll","partizip_zwei":"gequollen"},
  {"pl":"radzić","de":"raten","prateritum":"riet","partizip_zwei":"geraten"},
  {"pl":"trzeć","de":"reiben","prateritum":"rieb","partizip_zwei":"gerieben"},
  {"pl":"rozrywać","de":"reißen","prateritum":"riss","partizip_zwei":"gerissen"},
  {"pl":"jeździć konno","de":"reiten","prateritum":"ritt","partizip_zwei":"geritten"},
  {"pl":"pędzić, biec","de":"rennen","prateritum":"rannte","partizip_zwei":"gerannt"},
  {"pl":"pachnieć","de":"riechen","prateritum":"roch","partizip_zwei":"gerochen"},
  {"pl":"wołać","de":"rufen","prateritum":"rief","partizip_zwei":"gerufen"},
  {"pl":"tworzyć","de":"schaffen","prateritum":"schuf","partizip_zwei":"geschaffen"},
  {"pl":"świecić, wydawać się","de":"scheinen","prateritum":"schien","partizip_zwei":"geschienen"},
  {"pl":"pchać","de":"schieben","prateritum":"schob","partizip_zwei":"geschoben"},
  {"pl":"strzelać","de":"schießen","prateritum":"schoss","partizip_zwei":"geschossen"},
  {"pl":"spać","de":"schlafen","prateritum":"schlief","partizip_zwei":"geschlafen"},
  {"pl":"bić","de":"schlagen","prateritum":"schlug","partizip_zwei":"geschlagen"},
  {"pl":"zamykać","de":"schließen","prateritum":"schloss","partizip_zwei":"geschlossen"},
  {"pl":"wyrzucać, ciskać","de":"schmeißen","prateritum":"schmiss","partizip_zwei":"geschmissen"},
  {"pl":"kroić","de":"schneiden","prateritum":"schnitt","partizip_zwei":"geschnitten"},
  {"pl":"pisać","de":"schreiben","prateritum":"schrieb","partizip_zwei":"geschrieben"},
  {"pl":"krzyczeć","de":"schreien","prateritum":"schrie","partizip_zwei":"geschrien"},
  {"pl":"milczeć","de":"schweigen","prateritum":"schwieg","partizip_zwei":"geschwiegen"},
  {"pl":"pływać","de":"schwimmen","prateritum":"schwamm","partizip_zwei":"geschwommen"},
  {"pl":"widzieć","de":"sehen","prateritum":"sah","partizip_zwei":"gesehen"},
  {"pl":"być","de":"sein","prateritum":"war","partizip_zwei":"gewesen"},
  {"pl":"wysyłać","de":"senden","prateritum":"sandte","partizip_zwei":"gesandt"},
  {"pl":"śpiewać","de":"singen","prateritum":"sang","partizip_zwei":"gesungen"},
  {"pl":"opadać, tonąć","de":"sinken","prateritum":"sank","partizip_zwei":"gesunken"},
  {"pl":"siedzieć","de":"sitzen","prateritum":"saß","partizip_zwei":"gesessen"},
  {"pl":"mieć powinność","de":"sollen","prateritum":"sollte","partizip_zwei":"gesollt"},
  {"pl":"mówić","de":"sprechen","prateritum":"sprach","partizip_zwei":"gesprochen"},
  {"pl":"skakać","de":"springen","prateritum":"sprang","partizip_zwei":"gesprungen"},
  {"pl":"kłuć","de":"stechen","prateritum":"stach","partizip_zwei":"gestochen"},
  {"pl":"stać","de":"stehen","prateritum":"stand","partizip_zwei":"gestanden"},
  {"pl":"kraść","de":"stehlen","prateritum":"stahl","partizip_zwei":"gestohlen"},
  {"pl":"wchodzić, wspinać się","de":"steigen","prateritum":"stieg","partizip_zwei":"gestiegen"},
  {"pl":"umierać","de":"sterben","prateritum":"starb","partizip_zwei":"gestorben"},
  {"pl":"śmierdzieć","de":"stinken","prateritum":"stank","partizip_zwei":"gestunken"},
  {"pl":"potrącić, uderzać","de":"stoßen","prateritum":"stieß","partizip_zwei":"gestoßen"},
  {"pl":"kłócić się","de":"streiten","prateritum":"stritt","partizip_zwei":"gestritten"},
  {"pl":"uczestniczyć","de":"teilnehmen","prateritum":"nahm teil","partizip_zwei":"teilgenommen"},
  {"pl":"nosić","de":"tragen","prateritum":"trug","partizip_zwei":"getragen"},
  {"pl":"spotykać","de":"treffen","prateritum":"traf","partizip_zwei":"getroffen"},
  {"pl":"wchodzić","de":"treten","prateritum":"trat","partizip_zwei":"getreten"},
  {"pl":"pić","de":"trinken","prateritum":"trank","partizip_zwei":"getrunken"},
  {"pl":"oszukiwać","de":"trügen","prateritum":"trog","partizip_zwei":"getrogen"},
  {"pl":"czynić, robić","de":"tun","prateritum":"tat","partizip_zwei":"getan"},
  {"pl":"spędzać","de":"verbringen","prateritum":"verbrachte","partizip_zwei":"verbracht"},
  {"pl":"zapominać","de":"vergessen","prateritum":"vergaß","partizip_zwei":"vergessen"},
  {"pl":"obiecywać","de":"versprechen","prateritum":"versprach","partizip_zwei":"versprochen"},
  {"pl":"wybaczyć","de":"verzeihen","prateritum":"verzieh","partizip_zwei":"verziehen"},
  {"pl":"rosnąć","de":"wachsen","prateritum":"wuchs","partizip_zwei":"gewachsen"},
  {"pl":"prać/myć","de":"waschen","prateritum":"wusch","partizip_zwei":"gewaschen"},
  {"pl":"wyrzucać","de":"wegwerfen","prateritum":"warf weg","partizip_zwei":"weggeworfen"},
  {"pl":"zwracać się","de":"wenden","prateritum":"wandte","partizip_zwei":"gewandt"},
  {"pl":"reklamować","de":"werben","prateritum":"warb","partizip_zwei":"geworben"},
  {"pl":"rzucać","de":"werfen","prateritum":"warf","partizip_zwei":"geworfen"},
  {"pl":"ważyć","de":"wiegen","prateritum":"wog","partizip_zwei":"gewogen"},
  {"pl":"wiedzieć","de":"wissen","prateritum":"wusste","partizip_zwei":"gewusst"},
  {"pl":"chcieć","de":"wollen","prateritum":"wollte","partizip_zwei":"gewollt"},
  {"pl":"ciągnąć","de":"ziehen","prateritum":"zog","partizip_zwei":"gezogen"},
  {"pl":"zmuszać","de":"zwingen","prateritum":"zwang","partizip_zwei":"gezwungen"}
]

export default IrregularVerbs;
