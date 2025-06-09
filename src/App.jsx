
import './App.css';

import { PrimeReactProvider } from 'primereact/api';

import "primereact/resources/themes/viva-dark/theme.css"
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';

import { Routes, Route } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';

import WordsTable from './WordsTable';
import AppMenu from './AppMenu';
import HomePage from './HomePage';
import LoggingPage from './LoggingPage';
import LoadingPage from './LoadingPage';

import TextToSpeechEngine from './components/TextToSpeechEngine';

import { userState } from './states/user';
import { settings } from './states/settings';


function App() {
  const userName = userState((state) => state.userName)
  const isLogged = userState((state) => state.isLogged)

  const [isFormSent, setIsFormSent] = useState(false)
  const [loginErrMsg, setLoginErrMsg] = useState('');

  const setTokenRef = settings((state) => state.setTokenRef)
  const setRegionRef = settings((state) => state.setRegionRef)
  const tokenRefreshInterval = useRef(null);

  // Pobieranie tokena
  const fetchToken = async () => {
    try {
      const res = await fetch('https://flashcardsfunction.azurewebsites.net/api/GetSpeechToken');
      const { token, region } = await res.json();
      setTokenRef(token);
      setRegionRef(region);
      console.log('[Azure TTS] Token refreshed');
    } catch (err) {
      console.error('[Azure TTS] Błąd pobierania tokena:', err);
    }
  };
  
  // Odśwież token cyklicznie co 9 minut
  useEffect(() => {
    fetchToken(); // pobierz od razu na start

    tokenRefreshInterval.current = setInterval(() => {
      fetchToken();
    }, 9 * 60 * 1000); // 9 minut

    return () => {
      clearInterval(tokenRefreshInterval.current); // posprzątaj
    };
  }, []);


  const appLoader = () => {
    if (isLogged) {
      return (
        <PrimeReactProvider value={{ unstyled: false }}>
        <AppMenu />
          <Routes>
            <Route index path={'/flashcards/'} element={<HomePage userName={userName} />} />
            <Route path={'/flashcards/library/'} element={<WordsTable />} />
          </Routes>
        <TextToSpeechEngine />
        </PrimeReactProvider>
      )
    } else if (isFormSent) {
      return <LoadingPage />
    } else {
      return (
        <PrimeReactProvider value={{ unstyled: false }}>
          <LoggingPage 
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
