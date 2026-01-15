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
    setUserName(data['name']);
    setIsLogged(true);
    setIsMuted(data['isMuted'])
    setIsAdmin(data['isAdmin'])
    setIsActive(data['isActive'])
    setIsEditor(data['isEditor'])
    setLang_1(data['lang_1'])
    setLang_2(data['lang_2'])
    setSecondaryLanguage(data['lang_2'])
    setLang_3(data['lang_3'])
    setLang_4(data['lang_4'])
    setLang_5(data['lang_5'])
    setUiLang(data['lang_ui'])

    const numberOfNewWords = {
      "pl-PL": data['numberOfNewWords_pl'],
      "de-DE": data['numberOfNewWords_de'],
      "en-GB": data['numberOfNewWords_en'],
      "it-IT": data['numberOfNewWords_it'],
      "es-ES": data['numberOfNewWords_es']
    }
    setNumberOfNewWords(numberOfNewWords)

    const maxRepetitionDays = {
      "pl-PL": data['maxRepetitionDays_pl'],
      "de-DE": data['maxRepetitionDays_de'],
      "en-GB": data['maxRepetitionDays_en'],
      "it-IT": data['maxRepetitionDays_it'],
      "es-ES": data['maxRepetitionDays_es']
    }
    setMaxRepetitionDays(maxRepetitionDays)

    const checkArticle = {
      "de-DE": data['checkArticle_de'],
      "it-IT": data['checkArticle_it'],
      "es-ES": data['checkArticle_es']
    }
    setCheckArticle(checkArticle)

    const numberOfWordsToRepeat = {
      "pl-PL": data['numberOfWordsToRepeat_pl'],
      "de-DE": data['numberOfWordsToRepeat_de'],
      "en-GB": data['numberOfWordsToRepeat_en'],
      "it-IT": data['numberOfWordsToRepeat_it'],
      "es-ES": data['numberOfWordsToRepeat_es']
    }
    setNumberOfWordsToRepeat(numberOfWordsToRepeat)
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiRetry.get('/api/auth/me', { withCredentials: true });
        setUserVariables(res.data);
        props.setLoginErrMsg('');
      } catch (err) {

      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (data) => {
    props.setIsFormSent(true)

    const reqBody = {
      name: data.name,
      password: data.password
    };
  
    try {
      const res = await apiRetry.post('/api/auth/login', reqBody, { withCredentials: true });
      setUserVariables(res.data)
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
