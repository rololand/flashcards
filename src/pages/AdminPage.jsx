import { useState, useEffect, useRef } from 'react';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Formik } from "formik";
import { userState } from '../states/user';
import { settings } from '../states/settings.js';
import { Toast } from 'primereact/toast';

const langs = ["pl-PL", "de-DE", "en-GB", "it-IT", "es-ES"];

function AdminPage() {
  const userName = userState((state) => state.userName);
  const uiLang = settings((state) => state.uiLang);

  const [existingNames, setExistingNames] = useState([]);

  const myToast = useRef(null);

  const showToast = (severityValue, summaryValue, detailValue) => {   
    myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
  }

  useEffect(() => {
    async function fetchUserNames() {
      try {
        const res = await fetch("https://flashcardsfunction.azurewebsites.net/api/getUserNames");
        if (!res.ok) throw new Error("Błąd pobierania nazw użytkowników");
        const names = await res.json();
        setExistingNames(names);
      } catch (e) {
        console.error(e);
      }
    }
    fetchUserNames();
  }, []);

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{ minHeight: 300 }}>
      <div className="flex flex-column" style={{ width: 500, textAlign: "left" }}>

        <h2 className="mb-4">Dodaj użytkownika</h2>

        <Formik
          initialValues={{
            name: "",
            password: "",
            isMuted: false,
            lang_1: "pl-PL",
            lang_2: "",
            lang_3: "",
            lang_4: "",
            lang_5: "",
            isAdmin: false,
            isActive: true,
            lang_ui: "pl-PL",
            checkArticle_de: true,
            checkArticle_it: true,
            checkArticle_es: true,
            numberOfNewWords_pl: 10,
            numberOfNewWords_en: 10,
            numberOfNewWords_de: 10,
            numberOfNewWords_it: 10,
            numberOfNewWords_es: 10,
            maxRepetitionDays_pl: 90,
            maxRepetitionDays_en: 90,
            maxRepetitionDays_de: 90,
            maxRepetitionDays_it: 90,
            maxRepetitionDays_es: 90,
            isEditor: false,
            numberOfWordsToRepeat_pl: 20,
            numberOfWordsToRepeat_en: 20,
            numberOfWordsToRepeat_de: 20,
            numberOfWordsToRepeat_it: 20,
            numberOfWordsToRepeat_es: 20
          }}

          onSubmit={async (values, { resetForm }) => {
            try {
              const res = await fetch("https://flashcardsfunction.azurewebsites.net/api/addUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
              });

              if (!res.ok) {
                const err = await res.text();
                showToast('error','Something went wrong!',err)
                return;
              }

              showToast('success','Update completed','Your new user is saved.')
              resetForm();
            } catch (e) {
              showToast('error','Something went wrong!',e.message)
            }
          }}
        >
          {({ values, handleChange, setFieldValue, handleSubmit }) => {
            // Walidacja nazwy użytkownika
            let nameBorderClass = '';
            if (values.name === '') {
              nameBorderClass = '';
            } else if (existingNames.includes(values.name)) {
              nameBorderClass = 'border-red-500';
            } else {
              nameBorderClass = 'border-green-500';
            }

            return (
              <form onSubmit={handleSubmit} className="p-fluid flex flex-column gap-3">

                {/* name */}
                <div>
                  <label>name</label>
                  <InputText
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className={nameBorderClass}
                    style={{ borderWidth: '2px' }}
                  />
                </div>

                {/* password */}
                <div>
                  <label>password</label>
                  <InputText
                    name="password"
                    type="text"
                    value={values.password}
                    onChange={handleChange}
                  />
                </div>

                {/* isMuted */}
                <div className="flex align-items-center gap-2">
                  <Checkbox
                    inputId="isMuted"
                    checked={values.isMuted}
                    onChange={(e) => setFieldValue("isMuted", e.checked)}
                  />
                  <label htmlFor="isMuted">isMuted</label>
                </div>

                {/* isAdmin */}
                <div className="flex align-items-center gap-2">
                  <Checkbox
                    inputId="isAdmin"
                    checked={values.isAdmin}
                    onChange={(e) => setFieldValue("isAdmin", e.checked)}
                  />
                  <label htmlFor="isAdmin">isAdmin</label>
                </div>

                {/* isActive */}
                <div className="flex align-items-center gap-2">
                  <Checkbox
                    inputId="isActive"
                    checked={values.isActive}
                    onChange={(e) => setFieldValue("isActive", e.checked)}
                  />
                  <label htmlFor="isActive">isActive</label>
                </div>

                {/* isEditor */}
                <div className="flex align-items-center gap-2">
                  <Checkbox
                    inputId="isEditor"
                    checked={values.isEditor}
                    onChange={(e) => setFieldValue("isEditor", e.checked)}
                  />
                  <label htmlFor="isEditor">isEditor</label>
                </div>

                {/* lang_ui */}
                <div>
                  <label>lang_ui</label>
                  <Dropdown
                    options={langs}
                    value={values.lang_ui}
                    onChange={(e) => setFieldValue("lang_ui", e.value)}
                  />
                </div>

                {/* LANG DROPDOWNS */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <label>lang_{i}</label>
                    <Dropdown
                      options={langs}
                      value={values[`lang_${i}`]}
                      onChange={(e) => setFieldValue(`lang_${i}`, e.value)}
                      placeholder="Wybierz..."
                    />
                  </div>
                ))}

                {/* checkArticle_* */}
                {["de", "it", "es"].map((l) => (
                  <div className="flex align-items-center gap-2" key={l}>
                    <Checkbox
                      inputId={`checkArticle_${l}`}
                      checked={values[`checkArticle_${l}`]}
                      onChange={(e) => setFieldValue(`checkArticle_${l}`, e.checked)}
                    />
                    <label htmlFor={`checkArticle_${l}`}>checkArticle_{l}</label>
                  </div>
                ))}

                {/* numberOfNewWords_* */}
                {["pl", "en", "de", "it", "es"].map((l) => (
                  <div key={l}>
                    <label>numberOfNewWords_{l}</label>
                    <InputNumber
                      value={values[`numberOfNewWords_${l}`]}
                      onValueChange={(e) => setFieldValue(`numberOfNewWords_${l}`, e.value)}
                    />
                  </div>
                ))}

                {/* maxRepetitionDays_* */}
                {["pl", "en", "de", "it", "es"].map((l) => (
                  <div key={l}>
                    <label>maxRepetitionDays_{l}</label>
                    <InputNumber
                      value={values[`maxRepetitionDays_${l}`]}
                      onValueChange={(e) => setFieldValue(`maxRepetitionDays_${l}`, e.value)}
                    />
                  </div>
                ))}

                {/* numberOfWordsToRepeat_* */}
                {["pl", "en", "de", "it", "es"].map((l) => (
                  <div key={l}>
                    <label>numberOfWordsToRepeat_{l}</label>
                    <InputNumber
                      value={values[`numberOfWordsToRepeat_${l}`]}
                      onValueChange={(e) => setFieldValue(`numberOfWordsToRepeat_${l}`, e.value)}
                    />
                  </div>
                ))}

                <Button type="submit" label="Dodaj użytkownika" className="mt-4" />
              </form>
            );
          }}
        </Formik>
      </div>
      <Toast ref={myToast} /> 
    </div>
  );
}

export default AdminPage;
