import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { TabView, TabPanel } from "primereact/tabview";
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';

import { userState } from '../states/user';
import { settings } from "../states/settings.js";

import uitxt from '../uitxt.json';
import apiRetry from "../utils/apiRetry"; // <- retry

function SettingsPage(props) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // języki
  const lang_1 = settings((state) => state.lang_1);
  const setLang_1 = settings((state) => state.setLang_1);
  const lang_2 = settings((state) => state.lang_2);
  const setLang_2 = settings((state) => state.setLang_2);
  const lang_3 = settings((state) => state.lang_3);
  const setLang_3 = settings((state) => state.setLang_3);
  const lang_4 = settings((state) => state.lang_4);
  const setLang_4 = settings((state) => state.setLang_4);
  const lang_5 = settings((state) => state.lang_5);
  const setLang_5 = settings((state) => state.setLang_5);

  const languages = [lang_2, lang_3, lang_4, lang_5].filter(Boolean);

  // ogólne
  const userName = userState((state) => state.userName);
  const uiLang = settings((state) => state.uiLang);
  const setUiLang = settings((state) => state.setUiLang);
  const isMuted = settings((state) => state.isMuted);
  const toggleIsMuted = settings((state) => state.toggleIsMuted);

  // ustawienia języków
  const numberOfNewWords = settings((state) => state.numberOfNewWords);
  const setNumberOfNewWords = settings((state) => state.setNumberOfNewWords);
  const maxRepetitionDays = settings((state) => state.maxRepetitionDays);
  const setMaxRepetitionDays = settings((state) => state.setMaxRepetitionDays);
  const checkArticle = settings((state) => state.checkArticle);
  const setCheckArticle = settings((state) => state.setCheckArticle);
  const numberOfWordsToRepeat = settings((state) => state.numberOfWordsToRepeat);
  const setNumberOfWordsToRepeat = settings((state) => state.setNumberOfWordsToRepeat);

  const numberOfWordsToRepeatOptions = [5, 10, 20, 30, 50, 100].map((n) => ({ label: n.toString(), value: n }));
  const numberOfNewWordsOptions = [1, 2, 3, 5, 10, 20, 30].map((n) => ({ label: n.toString(), value: n }));
  const maxRepetitionDaysOptions = [
    { label: uitxt["34"][uiLang], value: 60 },
    { label: uitxt["35"][uiLang], value: 90 },
    { label: uitxt["36"][uiLang], value: 150 },
    { label: uitxt["37"][uiLang], value: 300 },
  ];
  const uiLangOptions = [
    { label: "PL", value: 'pl-PL' },
    { label: "EN", value: 'en-GB' },
  ];
  const langOptions = [
    { label: "PL", value: 'pl-PL' },
    { label: "EN", value: 'en-GB' },
    { label: "DE", value: 'de-DE' },
    { label: "IT", value: 'it-IT' },
    { label: "ES", value: 'es-ES' },
    { label: uitxt["38"][uiLang], value: 'none' },
  ];

  const getAvailableLangOptions = (currentLangValue) => {
    const allLang = [lang_1, lang_2, lang_3, lang_4, lang_5].filter(Boolean);
    return langOptions.filter(
      (option) =>
        option.value === 'none' || option.value === currentLangValue || !allLang.includes(option.value)
    );
  };

  const myToast = useRef(null);
  const showToast = (severityValue, summaryValue, detailValue) => {   
    myToast.current.show({ severity: severityValue, summary: summaryValue, detail: detailValue });   
  };

  const handleDropdownChange = (type, lang, value) => {
    if (type === "numberOfNewWords") {
      setNumberOfNewWords({ ...numberOfNewWords, [lang]: value });
    } else if (type === "maxRepetitionDays") {
      setMaxRepetitionDays({ ...maxRepetitionDays, [lang]: value });
    } else if (type === "article") {
      setCheckArticle({ ...checkArticle, [lang]: value });
    } else if (type === "numberOfWordsToRepeat") {
      setNumberOfWordsToRepeat({ ...numberOfWordsToRepeat, [lang]: value });
    }
  };

  const handleSaveSetting = async (data) => {
    setIsButtonDisabled(true);
    const reqBody = {
      name: userName,
      newUser: {
        isMuted,
        lang_1,
        lang_2,
        lang_3,
        lang_4,
        lang_5,
        lang_ui: uiLang,
        checkArticle_de: checkArticle['de-DE'],
        checkArticle_it: checkArticle['it-IT'],
        checkArticle_es: checkArticle['es-ES'],
        numberOfNewWords_pl: numberOfNewWords['pl-PL'],
        numberOfNewWords_en: numberOfNewWords['en-GB'],
        numberOfNewWords_de: numberOfNewWords['de-DE'],
        numberOfNewWords_it: numberOfNewWords['it-IT'],
        numberOfNewWords_es: numberOfNewWords['es-ES'],
        maxRepetitionDays_pl: maxRepetitionDays['pl-PL'],
        maxRepetitionDays_en: maxRepetitionDays['en-GB'],
        maxRepetitionDays_de: maxRepetitionDays['de-DE'],
        maxRepetitionDays_it: maxRepetitionDays['it-IT'],
        maxRepetitionDays_es: maxRepetitionDays['es-ES'],
        numberOfWordsToRepeat_pl: numberOfWordsToRepeat['pl-PL'],
        numberOfWordsToRepeat_en: numberOfWordsToRepeat['en-GB'],
        numberOfWordsToRepeat_de: numberOfWordsToRepeat['de-DE'],
        numberOfWordsToRepeat_it: numberOfWordsToRepeat['it-IT'],
        numberOfWordsToRepeat_es: numberOfWordsToRepeat['es-ES'],
      }
    };

    const azure_url = '/api/updateUser'; // baseURL w apiRetry
    try {
      await apiRetry.post(azure_url, reqBody);
      showToast('success','Update completed','Your new settings are saved.');
    } catch (err) {
      console.error('Error updating settings:', err);
      showToast('error','Something went wrong!','Settings are not saved.');
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const formik = useFormik({
    initialValues: { numberOfNewWords, maxRepetitionDays },
    enableReinitialize: true,
    onSubmit: handleSaveSetting,
  });

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{ minHeight: 300 }}>
      <div className="flex flex-column">
        <form onSubmit={formik.handleSubmit} className="p-4 max-w-2xl mx-auto">
          <TabView>
            {/* ---- General Tab ---- */}
            <TabPanel key='general' header={uitxt["39"][uiLang]}>
              {/* język główny */}
              <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <label className="block font-medium mb-1">{uitxt["40"][uiLang]}</label>
                <Dropdown value={lang_1 || 'none'} options={getAvailableLangOptions(lang_1)} onChange={(e) => setLang_1(e.value === 'none' ? null : e.value)} className="w-full" />
              </div>

              {/* pozostałe języki */}
              <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <label>{uitxt["41"][uiLang]}</label>
                <Dropdown value={lang_2 || 'none'} options={getAvailableLangOptions(lang_2)} onChange={(e) => setLang_2(e.value === 'none' ? null : e.value)} className="w-full" />
              </div>
              <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <label>{uitxt["42"][uiLang]}</label>
                <Dropdown value={lang_3 || 'none'} options={getAvailableLangOptions(lang_3)} onChange={(e) => setLang_3(e.value === 'none' ? null : e.value)} className="w-full" />
              </div>
              <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <label>{uitxt["43"][uiLang]}</label>
                <Dropdown value={lang_4 || 'none'} options={getAvailableLangOptions(lang_4)} onChange={(e) => setLang_4(e.value === 'none' ? null : e.value)} className="w-full" />
              </div>
              <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <label>{uitxt["44"][uiLang]}</label>
                <Dropdown value={lang_5 || 'none'} options={getAvailableLangOptions(lang_5)} onChange={(e) => setLang_5(e.value === 'none' ? null : e.value)} className="w-full" />
              </div>

              {/* UI Lang */}
              <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <label>{uitxt["45"][uiLang]}</label>
                <Dropdown value={uiLang} options={uiLangOptions} onChange={(e) => setUiLang(e.value)} className="w-full" />
              </div>

              {/* isMuted */}
              <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <label>{uitxt["17"][uiLang]}</label>
                <InputSwitch checked={isMuted} onChange={toggleIsMuted} />
              </div>
            </TabPanel>

            {/* ---- Language Tabs ---- */}
            {languages.map((lang) => (
              <TabPanel key={lang} header={lang.slice(0, 2).toUpperCase()}>
                {/* numberOfWordsToRepeat */}
                <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                  <label>{uitxt["46"][uiLang]}</label>
                  <Dropdown value={numberOfWordsToRepeat[lang]} options={numberOfWordsToRepeatOptions} onChange={(e) => handleDropdownChange("numberOfWordsToRepeat", lang, e.value)} className="w-full" />
                </div>

                {/* numberOfNewWords */}
                <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                  <label>{uitxt["47"][uiLang]}</label>
                  <Dropdown value={numberOfNewWords[lang]} options={numberOfNewWordsOptions} onChange={(e) => handleDropdownChange("numberOfNewWords", lang, e.value)} className="w-full" />
                </div>

                {/* maxRepetitionDays */}
                <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                  <label>{uitxt["48"][uiLang]}</label>
                  <Dropdown value={maxRepetitionDays[lang]} options={maxRepetitionDaysOptions} onChange={(e) => handleDropdownChange("maxRepetitionDays", lang, e.value)} className="w-full" />
                </div>

                {/* article checker */}
                {['de-DE', 'it-IT', 'es-ES'].includes(lang) && (
                  <div className="flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                    <label>{uitxt["49"][uiLang]}</label>
                    <InputSwitch checked={checkArticle[lang]} onChange={(e) => handleDropdownChange("article", lang, e.value)} />
                  </div>
                )}
              </TabPanel>
            ))}
          </TabView>

          <div className="mt-4 text-center">
            <Button label="Save" icon="pi pi-save" type="submit" disabled={isButtonDisabled} className="p-button-lg p-button-raised p-button-primary" />
          </div>
        </form>
      </div>
      <Toast ref={myToast} />
    </div>
  );
}

export default SettingsPage;
