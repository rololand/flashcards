
import { TabMenu } from 'primereact/tabmenu';
import { ProgressBar } from 'primereact/progressbar';
import { useState } from 'react';
import 'primeicons/primeicons.css';
import { settings } from "../states/settings.js";
import { userState } from "../states/user.js";
import { currentPageState } from "../states/currentPage.js";
import { wordsToDoState } from '../states/wordsToDo.js';

import uitxt from '../uitxt.json'

function AppMenu() {
    const [activeIndex, setActiveIndex] = useState()
    const uiLang = settings((state) => state.uiLang)
    const isEditor = userState((state) => state.isEditor)
    const isAdmin = userState((state) => state.isAdmin)
    const setCurrentPage = currentPageState((state) => state.setCurrentPage)
    const setCurrentExercisePage = currentPageState((state) => state.setCurrentExercisePage)
    const currentPage = currentPageState((state) => state.currentPage)
    const wordsInExerciseCount = wordsToDoState((state) => state.wordsInExerciseCount);
    const correctAnswersCount = wordsToDoState((state) => state.correctAnswersCount);
    const clearExerciseCounts = wordsToDoState((state) => state.clearExerciseCounts);

    const items = [
      {
        label: uitxt["8"][uiLang],
        icon: 'pi pi-home',
        command: () => {
          clearExerciseCounts([]);
          setCurrentPage('homePage')
          setCurrentExercisePage('welcomePage')
        }
      },
      {
        label: uitxt["33"][uiLang],
        icon: 'pi pi-cog',
        command: () => setCurrentPage('settings')
      },
      isEditor && {
        label: uitxt["9"][uiLang],
        icon: 'pi pi-language',
        command: () => setCurrentPage('library')
      },
      isAdmin &&  {
        label: uitxt["32"][uiLang],
        icon: 'pi pi-crown',
        command: () => setCurrentPage('admin')
      }
    ].filter(Boolean);

    const progressBarDisplayer = () => {
      let value = 0
      // console.log('correctAnswersCount: ', correctAnswersCount)
      // console.log('wordsInExerciseCount: ', wordsInExerciseCount)
      if(currentPage === 'homePage' & wordsInExerciseCount != 0) {
        value = correctAnswersCount/wordsInExerciseCount*100
      }
        
      return <ProgressBar 
        value={value}
        showValue={false}
        style={{ height: '2px', borderRadius: 0  }}
        ></ProgressBar>
    }

    return (
      <div>
        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
        {progressBarDisplayer()}
      </div>
    );
}

export default AppMenu;
