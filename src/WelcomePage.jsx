import { Button } from "primereact/button";
import { FloatLabel } from 'primereact/floatlabel';
import { Dropdown } from 'primereact/dropdown';

import { userState } from './states/user';
import { settings } from "./states/settings.js";
import { wordsToDoState } from './states/wordsToDo.js';
import { currentPageState } from "./states/currentPage.js";
import { isLoadedState } from './states/isLoaded.js';

import uitxt from './uitxt.json'

function WelcomePage(props) {
  const userName = userState((state) => state.userName)

  const setIsLoaded = isLoadedState((state) => state.setIsLoaded)

  const uiLang = settings((state) => state.uiLang)
  const secondaryLanguage = settings((state) => state.secondaryLanguage)
  const setSecondaryLanguage = settings((state) => state.setSecondaryLanguage)
  const learn_langs = settings((state) => state.learn_langs)
  const learn_langs_dropdown_list = learn_langs.map(lang => {
    const [langPart, countryPart] = lang.split("-");
      return {
        name: countryPart.toUpperCase(),
        code: lang
      };
  });
  const currentDropdownElement = learn_langs_dropdown_list.find(
    (option) => option.code === secondaryLanguage
  );

  const wordsToDoCount = wordsToDoState((state) => state.wordsToDoCount)

  const setCurrentPage = currentPageState((state) => state.setCurrentPage)
   
  const buttons = () => {
    if (wordsToDoCount > 0)
      return <div className="flex flex-wrap align-items-center justify-content-center ">
          <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
            <Button label={uitxt["7"][uiLang]} onClick={() => {setCurrentPage('flashCard')}} />
          </div>
          <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
            <Button label={uitxt["6"][uiLang]} onClick={() => {setCurrentPage('wordGuessing')}} />
          </div>
        </div>
    return <Button label={uitxt["5"][uiLang]} onClick={props.handleLearnClick} />
  }

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <div className="flex flex-column">
        <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
          <p className="m-0 text-primary" >{uitxt["1"][uiLang]} {userName}!</p>
        </div>
        <div className="card flex justify-content-center">
          <FloatLabel className="w-full md:w-14rem">
            <Dropdown 
              inputId="dd-city" 
              value={currentDropdownElement} 
              onChange={(e) => {
                setSecondaryLanguage(e.value.code)
                setIsLoaded(false)
              }} 
              options={learn_langs_dropdown_list} 
              optionLabel="name" 
              className="w-full" />
            <label htmlFor="dd-city">{uitxt["2"][uiLang]}</label>
          </FloatLabel>
        </div>
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          <p className="m-0 text-color-secondary" >{uitxt["3"][uiLang]} {wordsToDoCount} {uitxt["4"][uiLang]}</p>
        </div>
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          {buttons()}
        </div>
      </div>
    </div>

  );
}

export default WelcomePage;
