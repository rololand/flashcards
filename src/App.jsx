
import './App.css';
import axios from 'axios'

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

import "primereact/resources/themes/viva-dark/theme.css"
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';

import { Routes, Route } from "react-router-dom";

import WordsTable from './WordsTable';
import AppMenu from './AppMenu';
import HomePage from './HomePage';


function App() {

  return (
    <PrimeReactProvider>
      <AppMenu />
        <Routes>
          <Route index path={'/'} element={<HomePage />} />
          <Route path={'/library'} element={<WordsTable />} />
        </Routes>
    </PrimeReactProvider>
    

  );
}

export default App;
