import axios from 'axios'

import React from "react";
import { useFormik } from "formik";

import { useState, useRef } from 'react';

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { TabView, TabPanel } from "primereact/tabview";
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';

import { userState } from '../states/user';
import { settings } from "../states/settings.js";

import uitxt from '../uitxt.json'

function SettingsPage(props) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const lang_1 = settings((state) => state.lang_1)
  const setLang_1 = settings((state) => state.setLang_1)
  const lang_2 = settings((state) => state.lang_2)
  const setLang_2 = settings((state) => state.setLang_2)
  const lang_3 = settings((state) => state.lang_3)
  const setLang_3 = settings((state) => state.setLang_3)
  const lang_4 = settings((state) => state.lang_4)
  const setLang_4 = settings((state) => state.setLang_4)
  const lang_5 = settings((state) => state.lang_5)
  const setLang_5 = settings((state) => state.setLang_5)

  const languages = [lang_2, lang_3, lang_4, lang_5].filter(Boolean);

  // ustawienia ogolne
  // username TODO
  // haslo TODO
  const userName = userState((state) => state.userName)
  const uiLang = settings((state) => state.uiLang)
  const setUiLang = settings((state) => state.setUiLang)
  const isMuted = settings((state) => state.isMuted)
  const toggleIsMuted = settings((state) => state.toggleIsMuted)

  // ustawienia jezykow
  const numberOfNewWords = settings((state) => state.numberOfNewWords)
  const setNumberOfNewWords = settings((state) => state.setNumberOfNewWords)
  const maxRepetitionDays = settings((state) => state.maxRepetitionDays)
  const setMaxRepetitionDays = settings((state) => state.setMaxRepetitionDays)
  const checkArticle = settings((state) => state.checkArticle)
  const setCheckArticle = settings((state) => state.setCheckArticle)
  const numberOfWordsToRepeat = settings((state) => state.numberOfWordsToRepeat)
  const setNumberOfWordsToRepeat = settings((state) => state.setNumberOfWordsToRepeat)
  
  const numberOfWordsToRepeatOptions = [5, 10, 20, 30, 50, 100].map((n) => ({
    label: n.toString(),
    value: n,
  }));
  const numberOfNewWordsOptions = [1, 2, 3, 5, 10, 20, 30].map((n) => ({
    label: n.toString(),
    value: n,
  }));
  const maxRepetitionDaysOptions = [
    { label: uitxt["34"][uiLang], value: 60 },
    { label: uitxt["35"][uiLang], value: 90 },
    { label: uitxt["36"][uiLang], value: 150 },
    { label: uitxt["37"][uiLang], value: 300 },
  ];
  const uiLangOptions = [
    { label: "PL", value: 'pl-PL'},
    { label: "EN", value: 'en-GB'},
  ]
  const langOptions = [
    { label: "PL", value: 'pl-PL'},
    { label: "EN", value: 'en-GB'},
    { label: "DE", value: 'de-DE'},
    { label: "IT", value: 'it-IT'},
    { label: "ES", value: 'es-ES'},
    { label: uitxt["38"][uiLang], value: 'none'},
  ]

  const getAvailableLangOptions = (currentLangValue) => {
    const allLang = [lang_1, lang_2, lang_3, lang_4, lang_5].filter(Boolean);
    return langOptions.filter(
      (option) =>
        option.value === 'none' || option.value === currentLangValue || !allLang.includes(option.value)
    );
  };

  const myToast = useRef(null);

  const showToast = (severityValue, summaryValue, detailValue) => {   
    myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
  }

  const handleSaveSetting = async (data) => {
    setIsButtonDisabled(true)
    const reqBody = {
      "name": userName,
      "newUser": {
        // "name": data.name, - tu nowy user
        // "password": data.password, - tu nowe haslo
        "isMuted": isMuted,
        "lang_1": lang_1,
        "lang_2": lang_2,
        "lang_3": lang_3,
        "lang_4": lang_4,
        "lang_5": lang_5,
        "lang_ui": uiLang,
        "checkArticle_de": checkArticle['de-DE'],
        "checkArticle_it": checkArticle['it-IT'],
        "checkArticle_es": checkArticle['es-ES'],
        "numberOfNewWords_pl": numberOfNewWords['pl-PL'],
        "numberOfNewWords_en": numberOfNewWords['en-GB'],
        "numberOfNewWords_de": numberOfNewWords['de-DE'],
        "numberOfNewWords_it": numberOfNewWords['it-IT'],
        "numberOfNewWords_es": numberOfNewWords['es-ES'],
        "maxRepetitionDays_pl": maxRepetitionDays['pl-PL'],
        "maxRepetitionDays_en": maxRepetitionDays['en-GB'],
        "maxRepetitionDays_de": maxRepetitionDays['de-DE'],
        "maxRepetitionDays_it": maxRepetitionDays['it-IT'],
        "maxRepetitionDays_es": maxRepetitionDays['es-ES'],
        "numberOfWordsToRepeat_pl": numberOfWordsToRepeat['pl-PL'],
        "numberOfWordsToRepeat_en": numberOfWordsToRepeat['en-GB'],
        "numberOfWordsToRepeat_de": numberOfWordsToRepeat['de-DE'],
        "numberOfWordsToRepeat_it": numberOfWordsToRepeat['it-IT'],
        "numberOfWordsToRepeat_es": numberOfWordsToRepeat['es-ES']
      }
    }
    // props.setIsFormSent(true)

    const azure_url = 'https://flashcardsfunction.azurewebsites.net/api/updateUser';
  
    try {
      const res = await axios.post(azure_url, reqBody);
      showToast('success','Update completed','Your new settings are saved.')
      setIsButtonDisabled(false)
      return
    } catch (err) {
      // console.log('Saving failed', err);
      showToast('error','Something went wrong!','Settings are not saved.')
      setIsButtonDisabled(false)
    }
  };

  const formik = useFormik({
    initialValues: {
      numberOfNewWords,
      maxRepetitionDays,
    },
    enableReinitialize: true,
    onSubmit: handleSaveSetting
  });

  const handleDropdownChange = (type, lang, value) => {
    if (type === "numberOfNewWords") {
      setNumberOfNewWords({
        ...numberOfNewWords,
        [lang]: value,
      });
    } else if (type === "maxRepetitionDays") {
      setMaxRepetitionDays({
        ...maxRepetitionDays,
        [lang]: value,
      });
    } else if (type === "article") {
      setCheckArticle({
        ...checkArticle,
        [lang]: value,
      });
    } else if (type === "numberOfWordsToRepeat") {
      setNumberOfWordsToRepeat({
        ...numberOfWordsToRepeat,
        [lang]: value,
      });
    }
    // aktualizujemy też formika, żeby submit widział aktualne dane
    formik.setFieldValue(`${type}.${lang}`, value);
  };




  return (
  <div
      className="flex align-content-center justify-content-center flex-wrap text-center"
      style={{ minHeight: 300 }}
    >
    <div className="flex flex-column">
      <form onSubmit={formik.handleSubmit} className="p-4 max-w-2xl mx-auto">
        <TabView>
          <TabPanel key='general' header={uitxt["39"][uiLang]} >
            <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <label className="block font-medium mb-1">
                  {uitxt["40"][uiLang]}
                </label>
              </div>
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <Dropdown
                  value={lang_1 || 'none'}
                  options={getAvailableLangOptions(lang_1)}
                  onChange={(e) =>
                    setLang_1(e.value === 'none' ? null : e.value)
                  }
                  placeholder="Wybierz wartość"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <label className="block font-medium mb-1">
                  {uitxt["41"][uiLang]}
                </label>
              </div>
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <Dropdown
                  value={lang_2 || 'none'}
                  options={getAvailableLangOptions(lang_2)}
                  onChange={(e) =>
                    setLang_2(e.value === 'none' ? null : e.value)
                  }
                  placeholder="Wybierz wartość"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <label className="block font-medium mb-1">
                  {uitxt["42"][uiLang]}
                </label>
              </div>
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <Dropdown
                  value={lang_3 || 'none'}
                  options={getAvailableLangOptions(lang_3)}
                  onChange={(e) =>
                    setLang_3(e.value === 'none' ? null : e.value)
                  }
                  placeholder="Wybierz wartość"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <label className="block font-medium mb-1">
                  {uitxt["43"][uiLang]}
                </label>
              </div>
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <Dropdown
                  value={lang_4 || 'none'}
                  options={getAvailableLangOptions(lang_4)}
                  onChange={(e) =>
                    setLang_4(e.value === 'none' ? null : e.value)
                  }
                  placeholder="Wybierz wartość"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <label className="block font-medium mb-1">
                  {uitxt["44"][uiLang]}
                </label>
              </div>
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <Dropdown
                  value={lang_5 || 'none'}
                  options={getAvailableLangOptions(lang_5)}
                  onChange={(e) =>
                    setLang_5(e.value === 'none' ? null : e.value)
                  }
                  placeholder="Wybierz wartość"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <label className="block font-medium mb-1">
                  {uitxt["45"][uiLang]}
                </label>
              </div>
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <Dropdown
                  value={uiLang}
                  options={uiLangOptions}
                  onChange={(e) =>
                    setUiLang(e.value)
                  }
                  placeholder="Wybierz wartość"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <label className="block font-medium mb-1">
                  {uitxt["17"][uiLang]}
                </label>
              </div>
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                <InputSwitch checked={isMuted} onChange={() => toggleIsMuted()} />
              </div>
            </div>
          </TabPanel>
          {languages.map((lang) => (
            <TabPanel
              key={lang}
              header={lang.slice(0, 2).toUpperCase()}
            >
              {/* numberOfWordToRepeat */}
              <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                  <label className="block font-medium mb-1">
                    {uitxt["46"][uiLang]}
                  </label>
                </div>
                <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                  <Dropdown
                    value={numberOfWordsToRepeat[lang]}
                    options={numberOfWordsToRepeatOptions}
                    onChange={(e) =>
                      handleDropdownChange("numberOfWordsToRepeat", lang, e.value)
                    }
                    placeholder="Wybierz wartość"
                    className="w-full"
                  />
                </div>
              </div>

              {/* numberOfNewWords */}
              <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                  <label className="block font-medium mb-1">
                    {uitxt["47"][uiLang]}
                  </label>
                </div>
                <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                  <Dropdown
                    value={numberOfNewWords[lang]}
                    options={numberOfNewWordsOptions}
                    onChange={(e) =>
                      handleDropdownChange("numberOfNewWords", lang, e.value)
                    }
                    placeholder="Wybierz wartość"
                    className="w-full"
                  />
                </div>
              </div>

              {/* maxRepetitionDays */}
              <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                  <label className="block font-medium mb-1">
                    {uitxt["48"][uiLang]}
                  </label>
                </div>
                <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                  <Dropdown
                    value={maxRepetitionDays[lang]}
                    options={maxRepetitionDaysOptions}
                    onChange={(e) =>
                      handleDropdownChange("maxRepetitionDays", lang, e.value)
                    }
                    placeholder="Wybierz wartość"
                    className="w-full"
                  />
                </div>
              </div>

              {/* article checker */}
              {['de-DE', 'it-IT', 'es-ES'].includes(lang) && (
                <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                  <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                    <label className="block font-medium mb-1">
                      {uitxt["49"][uiLang]}
                    </label>
                  </div>
                  <div className="flex align-items-center justify-content-center h-4rem font-bold border-round p-2">
                    <InputSwitch
                      checked={checkArticle[lang]}
                      onChange={(e) =>
                        handleDropdownChange("article", lang, e.value)
                      }
                    />
                  </div>
                </div>
              )}
            </TabPanel>
          ))}
        </TabView>

        <div className="mt-4 text-center">
          <Button
            label="Save"
            icon="pi pi-save"
            type="submit"
            disabled={isButtonDisabled}
            className="p-button-lg p-button-raised p-button-primary"
          />
        </div>
      </form>
    </div>
    <Toast ref={myToast} /> 
  </div>
  );
}

export default SettingsPage;
