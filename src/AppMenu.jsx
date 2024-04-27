
import { TabMenu } from 'primereact/tabmenu';
import { useState } from 'react';
import 'primeicons/primeicons.css';
import { useNavigate } from 'react-router-dom';


function AppMenu() {
    const [activeIndex, setActiveIndex] = useState()
    const navigate = useNavigate();

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate('flashcards/')
        },
        {
            label: 'Library',
            icon: 'pi pi-language',
            command: () => navigate('flashcards/library/')
        },
    ]
    return (
        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
    );
}

export default AppMenu;
