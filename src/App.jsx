import './css/App.css';

import { PrimeReactProvider } from 'primereact/api';

import "primereact/resources/themes/viva-dark/theme.css"
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

import { useState, useRef, useEffect } from 'react';

import WordsTable from './pages/WordsTable';
import AppMenu from './components/AppMenu';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import LoggingPage from './pages/LoggingPage';
import LoadingPage from './pages/LoadingPage';

import TextToSpeechEngine from './components/TextToSpeechEngine';
import AudioUnlocker from './components/AudioUnlocker.jsx';

import { userState } from './states/user';
import { settings } from './states/settings';
import { currentPageState } from "./states/currentPage.js";

import { useAutoRefreshAfterIdle } from "./utils/autoRefresh.js";

function App() {
  const userName = userState((state) => state.userName)
  const isLogged = userState((state) => state.isLogged)

  // AUTO REFRESH
  useAutoRefreshAfterIdle({
    refreshAfter: 60 * 60 * 1000, // 1 minuta = 60 000
  });

  const [isFormSent, setIsFormSent] = useState(false)
  const [loginErrMsg, setLoginErrMsg] = useState('');

  const setTokenRef = settings((state) => state.setTokenRef)
  const setRegionRef = settings((state) => state.setRegionRef)
  const tokenRefreshInterval = useRef(null);

  const currentPage = currentPageState((state) => state.currentPage)

  // Pobieranie tokena
  const fetchToken = async () => {
    try {
      const res = await fetch('https://flashcardsfunction.azurewebsites.net/api/GetSpeechToken');
      const { token, region } = await res.json();
      setTokenRef(token);
      setRegionRef(region);
    } catch (err) {}
  };
  
  // Odśwież token co 9 minut
  useEffect(() => {
    fetchToken();

    tokenRefreshInterval.current = setInterval(() => {
      fetchToken();
    }, 9 * 60 * 1000);

    return () => {
      clearInterval(tokenRefreshInterval.current);
    };
  }, []);

  const appLoader = () => {
    if (isLogged) {
      return (
        <PrimeReactProvider value={{ unstyled: false }}>
          <AppMenu />
          {currentPage === 'homePage' && <HomePage />}
          {currentPage === 'library' && <WordsTable />}
          {currentPage === 'admin' && <AdminPage />}
          {currentPage === 'settings' && <SettingsPage />}
          <TextToSpeechEngine />
          <AudioUnlocker />
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

  return appLoader();
}

export default App;
