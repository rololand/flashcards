import axios from 'axios'

import { useFormik } from 'formik';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

function LoggingPage(props) {

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
      onSubmit: (data) => {
          props.setIsFormSent(true)
          const azure_url = 'https://flashcardsfunction.azurewebsites.net/api/users/' + data.password
          axios.get(azure_url)
            .then(res => {
              const username = res.data[0]['name'].charAt(0).toUpperCase() + res.data[0]['name'].slice(1)
              props.setUserName(username)
              props.setIsLogged(true)
              props.setLoginErrMsg('')
            })
            .catch(err => {
              console.log('Error: ' + err);
              props.setIsFormSent(false)
              props.setLoginErrMsg('Something went wrong, try it again.')
            });

          formik.resetForm();
      }
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
                      className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                    <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid('name') })}>Name*</label>
                </span>
                {getFormErrorMessage('name')}
            </div>
            <div className="field">
                <span className="p-float-label">
                    <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange} toggleMask
                        className={classNames({ 'p-invalid': isFormFieldValid('password') })} />
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
  