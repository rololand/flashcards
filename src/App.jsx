
import './App.css';

import { PrimeReactProvider } from 'primereact/api';

import "primereact/resources/themes/viva-dark/theme.css"
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';

import { Routes, Route } from "react-router-dom";
import { useState } from 'react';

import WordsTable from './WordsTable';
import AppMenu from './AppMenu';
import HomePage from './HomePage';
import LoggingPage from './LoggingPage';
import LoadingPage from './LoadingPage';


function App() {
  const [isLogged, setIsLogged] = useState(false)
  const [userName, setUserName] = useState('')
  const [isFormSent, setIsFormSent] = useState(false)
  const [loginErrMsg, setLoginErrMsg] = useState('');


  const appLoader = () => {
    if (isLogged) {
      return (
        <PrimeReactProvider>
        <AppMenu />
          <Routes>
            <Route index path={'/flashcards/'} element={<HomePage userName={userName} />} />
            <Route path={'/flashcards/library/'} element={<WordsTable />} />
          </Routes>
        </PrimeReactProvider>
      )
    } else if (isFormSent) {
      return <LoadingPage />
    } else {
      return (
        <PrimeReactProvider>
          <LoggingPage 
            setIsLogged={setIsLogged}
            setUserName={setUserName}
            setIsFormSent={setIsFormSent} 
            setLoginErrMsg={setLoginErrMsg}
            loginErrMsg={loginErrMsg}
          />
        </PrimeReactProvider>
      )
    }
  }

  return (
    appLoader()
  );
}

export default App;
