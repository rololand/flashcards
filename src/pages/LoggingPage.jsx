import { useFormik } from 'formik';
import { useEffect, useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

import LoadingPage from './LoadingPage';

import { userState } from '../states/user';
import { settings } from '../states/settings';

import apiRetry from "../utils/apiRetry";

function LoggingPage(props) {
  const setUserName = userState((state) => state.setUserName)
  const setIsLogged = userState((state) => state.setIsLogged)
  const setIsAdmin = userState((state) => state.setIsAdmin)
  const setIsActive = userState((state) => state.setIsActive)
  const setIsEditor = userState((state) => state.setIsEditor)

  const setIsMuted = settings((state) => state.setIsMuted)
  const setLang_1 = settings((state) => state.setLang_1)
  const setLang_2 = settings((state) => state.setLang_2)
  const setLang_3 = settings((state) => state.setLang_3)
  const setLang_4 = settings((state) => state.setLang_4)
  const setLang_5 = settings((state) => state.setLang_5)
  const setUiLang = settings((state) => state.setUiLang)
  const setNumberOfNewWords = settings((state) => state.setNumberOfNewWords)
  const setMaxRepetitionDays = settings((state) => state.setMaxRepetitionDays)
  const setCheckArticle = settings((state) => state.setCheckArticle)
  const setNumberOfWordsToRepeat = settings((state) => state.setNumberOfWordsToRepeat)
  const setSecondaryLanguage = settings((state) => state.setSecondaryLanguage)

  const [checkingAuth, setCheckingAuth] = useState(true);

  const setUserVariables = (data) => {    
    const user = data.user;
    setUserName(user['name']);
    setIsLogged(true);
    setIsMuted(user['isMuted'])
    setIsAdmin(user['isAdmin'])
    setIsActive(user['isActive'])
    setIsEditor(user['isEditor'])
    setLang_1(user['lang_1'])
    setLang_2(user['lang_2'])
    setSecondaryLanguage(user['lang_2'])
    setLang_3(user['lang_3'])
    setLang_4(user['lang_4'])
    setLang_5(user['lang_5'])
    setUiLang(user['lang_ui'])

    const numberOfNewWords = {
      "pl-PL": user['numberOfNewWords_pl'],
      "de-DE": user['numberOfNewWords_de'],
      "en-GB": user['numberOfNewWords_en'],
      "it-IT": user['numberOfNewWords_it'],
      "es-ES": user['numberOfNewWords_es']
    }
    setNumberOfNewWords(numberOfNewWords)

    const maxRepetitionDays = {
      "pl-PL": user['maxRepetitionDays_pl'],
      "de-DE": user['maxRepetitionDays_de'],
      "en-GB": user['maxRepetitionDays_en'],
      "it-IT": user['maxRepetitionDays_it'],
      "es-ES": user['maxRepetitionDays_es']
    }
    setMaxRepetitionDays(maxRepetitionDays)

    const checkArticle = {
      "de-DE": user['checkArticle_de'],
      "it-IT": user['checkArticle_it'],
      "es-ES": user['checkArticle_es']
    }
    setCheckArticle(checkArticle)

    const numberOfWordsToRepeat = {
      "pl-PL": user['numberOfWordsToRepeat_pl'],
      "de-DE": user['numberOfWordsToRepeat_de'],
      "en-GB": user['numberOfWordsToRepeat_en'],
      "it-IT": user['numberOfWordsToRepeat_it'],
      "es-ES": user['numberOfWordsToRepeat_es']
    }
    setNumberOfWordsToRepeat(numberOfWordsToRepeat)
  }

  // ======================
  // CHECK AUTH ON START
  // ======================
  useEffect(() => {
    const checkAuth = async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        setCheckingAuth(false);
        return;
      }

      try {
        const res = await apiRetry.post('/api/auth/refresh', {
          refreshToken: storedRefreshToken
        }, { withCredentials: true });

        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
        }

        setUserVariables(res.data);
        props.setLoginErrMsg('');

      } catch (err) {
        console.error("Refresh failed", err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // ======================
  // HANDLE LOGIN
  // ======================
  const handleLogin = async (data) => {
    props.setIsFormSent(true)

    const reqBody = {
      name: data.name,
      password: data.password
    };
  
    try {
      const res = await apiRetry.post('/api/auth/login', reqBody, { withCredentials: true });

      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      setUserVariables(res.data);
      props.setLoginErrMsg('');
      return
    } catch (err) {
      props.setIsFormSent(false);
      props.setLoginErrMsg('Something went wrong, try again.');
    }
  };  

  const formik = useFormik({
    initialValues: {
        name: '',
        password: '',
    },
    validate: (data) => {
        let errors = {};
        if (!data.name) errors.name = 'Name is required.';
        if (!data.password) errors.password = 'Password is required.';
        return errors;
    },
    onSubmit: handleLogin
  });

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
      return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };

  if (checkingAuth) {
    return <LoadingPage />;
  }

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <form onSubmit={formik.handleSubmit} className="p-fluid">
        <div className="field">
          <span className="p-float-label">
            <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} autoFocus
              className={classNames({ 'p-invalid': isFormFieldValid('name') })} autoComplete="off" />
            <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid('name') })}>Login*</label>
          </span>
          {getFormErrorMessage('name')}
        </div>
        <div className="field">
          <span className="p-float-label">
            <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange} toggleMask
              className={classNames({ 'p-invalid': isFormFieldValid('password') })} feedback={false} />
            <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>Password*</label>
          </span>
          {getFormErrorMessage('password')}
        </div>
        <Button type="submit" label="login" className="mt-2" />
        <p>{props.loginErrMsg}</p>
      </form>
    </div>
  );
}

export default LoggingPage;
