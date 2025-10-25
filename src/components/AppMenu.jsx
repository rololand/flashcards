
import { TabMenu } from 'primereact/tabmenu';
import { useState } from 'react';
import 'primeicons/primeicons.css';
import { useNavigate } from 'react-router-dom';
import { settings } from "../states/settings.js";
import { userState } from "../states/user.js";

import uitxt from '../uitxt.json'

function AppMenu() {
    const [activeIndex, setActiveIndex] = useState()
    const navigate = useNavigate();
    const uiLang = settings((state) => state.uiLang)
    const isEditor = userState((state) => state.isEditor)
    const isAdmin = userState((state) => state.isAdmin)

    const items = [
        {
            label: uitxt["8"][uiLang],
            icon: 'pi pi-home',
            command: () => navigate('flashcards/')
        },
        {
            label: uitxt["33"][uiLang],
            icon: 'pi pi-cog',
            command: () => navigate('flashcards/settings/')
        },
        isEditor && {
            label: uitxt["9"][uiLang],
            icon: 'pi pi-language',
            command: () => navigate('flashcards/library/')
        },
        isAdmin &&  {
            label: uitxt["32"][uiLang],
            icon: 'pi pi-crown',
            command: () => navigate('flashcards/admin/')
        }
        // ustawienia uitxt 10
    ].filter(Boolean);

    return (
        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
    );
}

export default AppMenu;
