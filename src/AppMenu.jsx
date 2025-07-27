
import { TabMenu } from 'primereact/tabmenu';
import { useState } from 'react';
import 'primeicons/primeicons.css';
import { useNavigate } from 'react-router-dom';
import { settings } from "./states/settings.js";

import uitxt from './uitxt.json'

function AppMenu() {
    const [activeIndex, setActiveIndex] = useState()
    const navigate = useNavigate();
    const uiLang = settings((state) => state.uiLang)

    const items = [
        {
            label: uitxt["8"][uiLang],
            icon: 'pi pi-home',
            command: () => navigate('flashcards/')
        },
        {
            label: uitxt["9"][uiLang],
            icon: 'pi pi-language',
            command: () => navigate('flashcards/library/')
        },
        // ustawienia uitxt 10
    ]
    return (
        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
    );
}

export default AppMenu;
