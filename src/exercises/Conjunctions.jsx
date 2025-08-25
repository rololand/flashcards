import { useState, useEffect, useRef } from 'react';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

import { settings } from "../states/settings.js";

import uitxt from '../uitxt.json'

function Conjunctions(props) {
  const uiLang = settings((state) => state.uiLang)

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <div className="flex flex-column">
        {ConjunctionQuiz()}
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          <Button label={uitxt["13"][uiLang]} onClick={props.handleSummaryBackClick} />
        </div>
      </div>
    </div>
  );
}

function ConjunctionQuiz() {
    const [current, setCurrent] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);

    const uiLang = settings((state) => state.uiLang)

    useEffect(() => {
        loadRandomConjunction();
    }, []);

    const loadRandomConjunction = () => {
        const random = conjunctions[Math.floor(Math.random() * conjunctions.length)];
        setCurrent(random);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
    };

    const handleAnswer = (type) => {
        if (selectedAnswer) return; // nie pozwala kliknąć ponownie
        setSelectedAnswer(type);
        setCorrectAnswer(current.answer);
    };

    const getButtonClass = (type) => {
        if (!selectedAnswer) return 'p-button-outlined';
        if (type === correctAnswer) return 'p-button-success';
        return 'p-button-danger';
    };

    if (!current) return null;

    return (
      <Card className="p-m-4 p-shadow-4">
        <div className="p-d-flex p-flex-column p-ai-center p-gap-3">
          <h2><span className="text-purple-500">{current.pl}: </span>{current.de}</h2>
          <div className="my-5 p-d-flex p-flex-column p-ai-center p-gap-3">{uitxt["27"][uiLang]}</div>
          <div className="my-5 p-d-flex p-jc-center p-gap-3">
            <Button
              key={"normal"}
              label={uitxt["29"][uiLang]}
              onClick={() => handleAnswer("normal")}
              className={getButtonClass("normal") + " mx-2"}
              disabled={!!selectedAnswer}
            />
            <Button
              key={"flipped"}
              label={uitxt["30"][uiLang]}
              onClick={() => handleAnswer("flipped")}
              className={getButtonClass("flipped") + " mx-2"}
              disabled={!!selectedAnswer}
            />
            <Button
              key={"ended"}
              label={uitxt["31"][uiLang]}
              onClick={() => handleAnswer("ended")}
              className={getButtonClass("ended") + " mx-2"}
              disabled={!!selectedAnswer}
            />
          </div>
          {selectedAnswer && (
            <>
              <Divider />
              <div
                className="p-text-center p-mb-2"
                dangerouslySetInnerHTML={{ __html: `<strong>${current.sentence["de-DE"]}</strong>` }}
              />
              <div
                className="p-text-center p-mb-3"
                dangerouslySetInnerHTML={{ __html: `<em>${current.sentence["pl-PL"]}</em>` }}
              />
            </>
          )}
          <div className="my-5 p-mt-4">
            <Button
              label={uitxt["28"][uiLang]}
              icon="pi pi-refresh"
              onClick={loadRandomConjunction}
              severity="secondary"
            />
          </div>
        </div>
      </Card>
    );
}

const conjunctions = [
    {
      "pl": "i, oraz, a", 
      "de": "und", 
      "answer": "normal", 
      "sentence": {
        "pl-PL": 'Padał deszcz, <span class="text-orange-500">a</span> <span class="text-green-500">ja</span> <span class="text-red-500">nie mogłem</span> znaleźć nigdzie mojego parasola.', 
        "de-DE": 'Es regnete <span class="text-orange-500">und</span> <span class="text-green-500">ich</span> <span class="text-red-500">konnte nirgendewo</span> meinen Regenschrim finden.',
      }
    },
    {
      "pl": "lub, albo, czy", 
      "de": "oder", 
      "answer": "normal", 
      "sentence": {
        "pl-PL": 'Pójdę psać <span class="text-orange-500">albo</span> <span class="text-green-500">(ja)</span> <span class="text-red-500">poczytam</span> jeszcze coś w łóżku.', 
        "de-DE": 'Ich gehe schlafen <span class="text-orange-500">oder</span> <span class="text-green-500">ich</span> <span class="text-red-500">lese</span> noch etwas im Bett.'
      }
    },
    {
      "pl": "ale", 
      "de": "aber", 
      "answer": "normal", 
      "sentence": {
        "pl-PL": 'Chcieliśmy mu pomóc <span class="text-orange-500">ale</span> <span class="text-green-500">(my)</span> <span class="text-red-500">nie mieliśmy</span> czasu.', 
        "de-DE": 'Wir wollten ihm helfen, <span class="text-orange-500">aber</span> <span class="text-green-500">wir</span> <span class="text-red-500">hatten keine</span> Zeit.'
      }
    },
    {
      "pl": "więc", 
      "de": "also", 
      "answer": "flipped", 
      "sentence": {
        "pl-PL": 'Nie zdążyliśmy na nasz pociąg, <span class="text-orange-500">więc</span> <span class="text-green-500">(my)</span> <span class="text-red-500">musimy</span> teraz poczekać na następny', 
        "de-DE": 'Wir haben unseren Zug verpasst, <span class="text-orange-500">also</span> <span class="text-red-500">mussen</span> <span class="text-green-500">wir</span> jetzt aud den nächsten warten.'
      }
    },
    {
      "pl": "kiedy, gdy", 
      "de": "wenn", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": '<span class="text-orange-500">Gdy</span> <span class="text-green-500">babcia</span> <span class="text-red-500">przychodziła</span> w odwiedziny, przynosiła zawsze coś słodkiego dla dzieci.', 
        "de-DE": '<span class="text-orange-500">Wenn</span> <span class="text-green-500">die Oma</span> zu Besuch <span class="text-red-500">kam</span>, brachte sie immer etwas Süßes für die Kinder mit.'
      }
    },
    {
      "pl": "kiedy, gdy", 
      "de": "als", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": 'Miałem skomplikowaną operację, <span class="text-orange-500">gdy</span> <span class="text-green-500">(ja)</span> <span class="text-red-500">miałem</span> trzynaście lat.', 
        "de-DE": 'Ich hatte eine komplizierte Operation, <span class="text-orange-500">als</span> <span class="text-green-500">ich</span> dreizehn <span class="text-red-500">war</span>.'
      }
    },
    {
      "pl": "lecz, ale", 
      "de": "sondern", 
      "answer": "normal", 
      "sentence": {
        "pl-PL": 'Nie wychodzimy dziś, <span class="text-orange-500">lecz</span> <span class="text-green-500">(my)</span> <span class="text-red-500">organizujemy</span> imprezę w domu.', 
        "de-DE": 'Wir gehen nicht aus, <span class="text-orange-500">sondern</span> <span class="text-green-500">wir</span> <span class="text-red-500">organiesieren</span> eine Party zu Hause.'
      }
    },
    {
      "pl": "ponieważ, bo, gdyż", 
      "de": "denn", 
      "answer": "normal", 
      "sentence": {
        "pl-PL": 'Powinniście kupić ten dom, <span class="text-orange-500">bo</span> <span class="text-green-500">ta oferta</span> <span class="text-red-500">jest</span> naprawdę korzystna.', 
        "de-DE": 'Ihr solltet das Haus kaufen, <span class="text-orange-500">denn</span> <span class="text-green-500">das Angebot</span> <span class="text-red-500">ist</span> richtig preiswert.'
      }
    },
    {
      "pl": "poza tym, oprócz tego", 
      "de": "außerdem", 
      "answer": "flipped", 
      "sentence": {
        "pl-PL": 'Anna jedzie na urlop, <span class="text-orange-500">poza tym</span> <span class="text-green-500">(ona)</span> <span class="text-red-500">kupuje</span> nowe auto.', 
        "de-DE": 'Anna fährt in Urlaub, <span class="text-orange-500">außerdem</span> <span class="text-red-500">kauft</span> <span class="text-green-500">sie</span> ein neues Auto.'
      }
    },
    {
      "pl": "następnie, potem", 
      "de": "dann", 
      "answer": "flipped", 
      "sentence": {
        "pl-PL": 'Zadzwonię do niej, <span class="text-orange-500">potem</span> <span class="text-green-500">(ja)</span> <span class="text-red-500">podejmę</span> jakąś decyzję.', 
        "de-DE": 'Ich rufe sie an, <span class="text-orange-500">dann</span> <span class="text-red-500">treffe</span> <span class="text-green-500">ich</span> eine Entscheidung.'
      }
    },
    {
      "pl": "jednak", 
      "de": "doch, jedoch", 
      "answer": "flipped", 
      "sentence": {
        "pl-PL": 'Miał wielu przyjaciół, <span class="text-orange-500">jednak</span> <span class="text-green-500">(on)</span>  <span class="text-red-500">czuł</span> się samotny.', 
        "de-DE": 'Er hatte viele Bekannte, <span class="text-orange-500">jedoch</span> <span class="text-red-500">fühlte</span> <span class="text-green-500">er</span> sich oft einsam.'
      }
    },
    {
      "pl": "aż, dopóki nie", 
      "de": "bis", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": 'Powinieneś pozostać w łóżku, <span class="text-orange-500">dopóki nie</span> <span class="text-green-500">(ty)</span> <span class="text-red-500">wyzdrowiejesz</span>.', 
        "de-DE": 'Du solltest im Bett bleiben, <span class="text-orange-500">bis</span> <span class="text-green-500">du</span> wieder gesund <span class="text-red-500">wirst</span>.'
      }
    },
    {
      "pl": "ponieważ, gdyż, bo", 
      "de": "weil", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": 'Kupię używany komputer, <span class="text-orange-500">ponieważ</span> <span class="text-green-500">(ja)</span> <span class="text-red-500">mam</span> teraz niewielę pieniędzy.', 
        "de-DE": 'Ich kaufe mir einen gebrauchten Computer, <span class="text-orange-500">weil</span> <span class="text-green-500">ich</span> im Moment wenig Geld <span class="text-red-500">habe</span>.'
      }
    },
    {
      "pl": "ponieważ, gdyż, bo", 
      "de": "da", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": '<span class="text-orange-500">Ponieważ</span> <span class="text-green-500">(ja)</span> <span class="text-red-500">byłem</span> bardzo chory, nie mogłem pójść do szkoły.', 
        "de-DE": '<span class="text-orange-500">Da</span> <span class="text-green-500">ich</span> sehr krank<span class="text-red-500">war</span>, konnte ich nicht zur Schule gehen.'
      }
    },
    {
      "pl": "aby, [a]żeby", 
      "de": "damit", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": 'Rodzice kupują nowe moble, <span class="text-orange-500">żeby</span> <span class="text-green-500">pokój dizecięcy</span> <span class="text-red-500">wyglądał</span> trochę przytulniej.', 
        "de-DE": 'Die Eltern kaufen neue Möbel, <span class="text-orange-500">damit</span> <span class="text-green-500">das Kinderzimmer</span> etwas gemütlicher <span class="text-red-500">aussieht</span>.'
      }
    },
    {
      "pl": "że", 
      "de": "dass", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": 'Mam nadzieję, <span class="text-orange-500">że</span> <span class="text-green-500">(ty)</span> <span class="text-red-500">nie zapomnisz</span> o tym spotkaniu.', 
        "de-DE": 'Ich hoffe, <span class="text-orange-500">dass</span> <span class="text-green-500">du</span> diesen Termin <span class="text-red-500">nicht vergisst</span>.'
      }
    },
    {
      "pl": "jeśli, jeżeli, gdyby", 
      "de": "wenn", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": '<span class="text-orange-500">Gdybyśmy</span> <span class="text-green-500">(my)</span> <span class="text-red-500">mieli</span> więcej czasu, zwiedzilibyśmy również katedrę.', 
        "de-DE": '<span class="text-orange-500">Wenn</span> <span class="text-green-500">wir</span> mehr Zeit <span class="text-red-500">hätten</span>, würden wir auch die Kathedrale besichtigen.'
      }
    },
    {
      "pl": "dlatego", 
      "de": "deshalb", 
      "answer": "flipped", 
      "sentence": {
        "pl-PL": 'Jestem alergikiem, <span class="text-orange-500">dlatego</span> <span class="text-green-500">(my)</span> <span class="text-red-500">nie mamy</span> zwierzęcia domowego.', 
        "de-DE": 'Ich bin Allergiker, <span class="text-orange-500">deshalb</span> <span class="text-red-500">haben</span> <span class="text-green-500">wir</span> kein Haustier.'
      }
    },
    {
      "pl": "dlatego", 
      "de": "darum", 
      "answer": "flipped", 
      "sentence": {
        "pl-PL": 'Jestem alergikiem, <span class="text-orange-500">dlatego</span> <span class="text-green-500">(my)</span> <span class="text-red-500">nie mamy</span> zwierzęcia domowego.', 
        "de-DE": 'Ich bin Allergiker, <span class="text-orange-500">darum</span> <span class="text-red-500">haben</span> <span class="text-green-500">wir</span> kein Haustier.'
      }
    },
    {
      "pl": "dlatego", 
      "de": "deswegen", 
      "answer": "flipped", 
      "sentence": {
        "pl-PL": 'Jestem alergikiem, <span class="text-orange-500">dlatego</span> <span class="text-green-500">(my)</span> <span class="text-red-500">nie mamy</span> zwierzęcia domowego.', 
        "de-DE": 'Ich bin Allergiker, <span class="text-orange-500">deswegen</span> <span class="text-red-500">haben</span> <span class="text-green-500">wir</span> kein Haustier.'
      }
    },
    {
      "pl": "a więc, wobec tego", 
      "de": "folglich", 
      "answer": "flipped", 
      "sentence": {
        "pl-PL": 'Uczeń był nieobecny ostatnim razem, <span class="text-orange-500">wobec tego</span> <span class="text-green-500">(on)</span>  <span class="text-red-500">nie jest</span> dobrze przygotowany.', 
        "de-DE": 'Der Schüler war letztes Mal nicht da, <span class="text-orange-500">folglich</span> <span class="text-red-500">ist</span> <span class="text-green-500">er</span> nicht gut vorbereitet.'
      }
    },
    {
      "pl": "w przeciwnym razie", 
      "de": "sonst", 
      "answer": "flipped", 
      "sentence": {
        "pl-PL": 'Musisz zdać egzamin, <span class="text-orange-500">w przeciwnym razie</span> <span class="text-green-500">(ty)</span>  <span class="text-red-500">nie będziesz mógł</span> pojechać na wakacje.', 
        "de-DE": 'Du must das Examen bestehen, <span class="text-orange-500">sonst</span> <span class="text-red-500">kannst</span> <span class="text-green-500">du</span> nicht in die Sommerferien fahren.'
      }
    },
    {
      "pl": "mimo to", 
      "de": "trotzdem", 
      "answer": "flipped", 
      "sentence": {
        "pl-PL": 'Chłopiec mieszka za granicą, <span class="text-orange-500">mimo to</span> <span class="text-green-500">(on)</span>  <span class="text-red-500">ma</span> wielu znajomych w swojej oczyźnie.', 
        "de-DE": 'Der Junge wohnt im Ausland, <span class="text-orange-500">trotzdem</span> <span class="text-red-500">hat</span> <span class="text-green-500">er</span> viele Bekannte in seinem Heimatland.'
      }
    },
    {
      "pl": "podczas gdy", 
      "de": "während", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": '<span class="text-orange-500">Podczas gdy</span> <span class="text-green-500">mój tata</span> <span class="text-red-500">naprawiał</span> samochód, mama gotowała pyszną zupę pomidorową.', 
        "de-DE": '<span class="text-orange-500">Während</span> <span class="text-green-500">mein Vater</span> das Auto <span class="text-red-500">reparierte</span>, kochte meine Mutti eine leckere Tomatensuppe.'
      }
    },
    {
      "pl": "po tym jak; gdy", 
      "de": "nachdem", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": '<span class="text-orange-500">Po tym, jak</span> <span class="text-green-500">Max</span> <span class="text-red-500">zdał</span> maturę, może studiować na uniwersytecie.', 
        "de-DE": '<span class="text-orange-500">Nachdem</span> <span class="text-green-500">Max</span> das Abitur gemacht <span class="text-red-500">hat</span>, kann er an der Uni studieren.'
      }
    },
    {
      "pl": "", 
      "de": "", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": '<span class="text-orange-500">spojnik</span> <span class="text-green-500">podmiot</span> <span class="text-red-500">orzeczenie</span>', 
        "de-DE": '<span class="text-orange-500">spojnik</span> <span class="text-green-500">podmiot</span> <span class="text-red-500">orzeczenie</span>'
      }
    },
    {
      "pl": "", 
      "de": "", 
      "answer": "ended", 
      "sentence": {
        "pl-PL": '<span class="text-orange-500">spojnik</span> <span class="text-green-500">podmiot</span> <span class="text-red-500">orzeczenie</span>', 
        "de-DE": '<span class="text-orange-500">spojnik</span> <span class="text-green-500">podmiot</span> <span class="text-red-500">orzeczenie</span>'
      }
    },




    // {
    //   "pl": "", 
    //   "de": "", 
    //   "answer": "flipped", 
    //   "sentence": {
    //     "pl-PL": '<span class="text-orange-500">spojnik</span> <span class="text-green-500">podmiot</span>  <span class="text-red-500">orzeczenie</span> ', 
    //     "de-DE": '<span class="text-orange-500">spojnik</span> <span class="text-red-500">orzeczenie</span> <span class="text-green-500">podmiot</span> '
    //   }
    // },
    // {
    //   "pl": "", 
    //   "de": "", 
    //   "answer": "normal", 
    //   "sentence": {
    //     "pl-PL": '<span class="text-orange-500">spojnik</span> <span class="text-green-500">podmiot</span> <span class="text-red-500">orzeczenie</span>', 
    //     "de-DE": '<span class="text-orange-500">spojnik</span> <span class="text-green-500">podmiot</span> <span class="text-red-500">orzeczenie</span>'
    //   }
    // },
    // {
    //   "pl": "", 
    //   "de": "", 
    //   "answer": "ended", 
    //   "sentence": {
    //     "pl-PL": '<span class="text-orange-500">spojnik</span> <span class="text-green-500">podmiot</span> <span class="text-red-500">orzeczenie</span>', 
    //     "de-DE": '<span class="text-orange-500">spojnik</span> <span class="text-green-500">podmiot</span> <span class="text-red-500">orzeczenie</span>'
    //   }
    // },
]

export default Conjunctions;