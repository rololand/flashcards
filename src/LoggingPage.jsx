import axios from 'axios'

import { useFormik } from 'formik';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

import { userState } from './states/user';
import { settings } from './states/settings';

function LoggingPage(props) {
  const setUserName = userState((state) => state.setUserName)
  const setIsLogged = userState((state) => state.setIsLogged)

  const setIsMuted = settings((state) => state.setIsMuted)
  const setLang_1 = settings((state) => state.setLang_1)
  const setLang_2 = settings((state) => state.setLang_2)
  const setLang_3 = settings((state) => state.setLang_3)
  const setLang_4 = settings((state) => state.setLang_4)
  const setLang_5 = settings((state) => state.setLang_5)

  const handleLogin = async (data) => {
    props.setIsFormSent(true)

    const azure_url = 'https://flashcardsfunction.azurewebsites.net/api/users';
    const reqBody = {
      name: data.name,
      password: data.password
    };
  
    try {
      console.log('First attempt');
      const res = await axios.post(azure_url, reqBody);
      const username = res.data[0]['name'].charAt(0).toUpperCase() + res.data[0]['name'].slice(1);
      const isMuted = res.data[0]['isMuted']
      const lang_1 = res.data[0]['lang_1']
      const lang_2 = res.data[0]['lang_2']
      const lang_3 = res.data[0]['lang_3']
      const lang_4 = res.data[0]['lang_4']
      const lang_5 = res.data[0]['lang_5']
      setUserName(username);
      setIsLogged(true);
      setIsMuted(isMuted)
      setLang_1(lang_1)
      setLang_2(lang_2)
      setLang_3(lang_3)
      setLang_4(lang_4)
      setLang_5(lang_5)
      props.setLoginErrMsg('');
      return
    } catch (err) {
      console.log('First attempt failed, waiting 20 seconds...', err);
    }

    await new Promise(resolve => setTimeout(resolve, 20000));
  
    try {
      console.log('Second attempt');
      const res = await axios.post(azure_url, reqBody);
      const username = res.data[0]['name'].charAt(0).toUpperCase() + res.data[0]['name'].slice(1);
      const isMuted = res.data[0]['isMuted']
      const lang_1 = res.data[0]['lang_1']
      const lang_2 = res.data[0]['lang_2']
      const lang_3 = res.data[0]['lang_3']
      const lang_4 = res.data[0]['lang_4']
      const lang_5 = res.data[0]['lang_5']
      setUserName(username);
      setIsLogged(true);
      setIsMuted(isMuted)
      setLang_1(lang_1)
      setLang_2(lang_2)
      setLang_3(lang_3)
      setLang_4(lang_4)
      setLang_5(lang_5)
      props.setLoginErrMsg('');
    } catch (err2) {
      console.log('Second attempt failed:', err2);
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

          if (!data.name) {
              errors.name = 'Name is required.';
          }

          if (!data.password) {
              errors.password = 'Password is required.';
          }

          return errors;
      },
      onSubmit: handleLogin
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
      <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className="field">
                <span className="p-float-label">
                    <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} autoFocus
                      className={classNames({ 'p-invalid': isFormFieldValid('name') })} autoComplete="off" />
                    <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid('name') })}>Name*</label>
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
  