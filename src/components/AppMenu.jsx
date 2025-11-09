
import { TabMenu } from 'primereact/tabmenu';
import { useState } from 'react';
import 'primeicons/primeicons.css';
import { settings } from "../states/settings.js";
import { userState } from "../states/user.js";
import { currentPageState } from "../states/currentPage.js";

import uitxt from '../uitxt.json'

function AppMenu() {
    const [activeIndex, setActiveIndex] = useState()
    const uiLang = settings((state) => state.uiLang)
    const isEditor = userState((state) => state.isEditor)
    const isAdmin = userState((state) => state.isAdmin)
    const setCurrentPage = currentPageState((state) => state.setCurrentPage)

    const items = [
        {
            label: uitxt["8"][uiLang],
            icon: 'pi pi-home',
            command: () => setCurrentPage('homePage')
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

    return (
        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
    );
}

export default AppMenu;
