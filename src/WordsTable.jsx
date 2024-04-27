
import axios from 'axios'

import { PrimeReactProvider } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';

import { useEffect, useState, useRef } from 'react';

import LoadingPage from './LoadingPage';


function WordsTable() {
  const [words, setWords] = useState([])
  const [isNewData, setIsNewData] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const azure_url = 'https://flashcardsfunction.azurewebsites.net/api/words'

  const myToast = useRef(null);

  const showToast = (severityValue, summaryValue, detailValue) => {   
    myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
  }

  useEffect(() => {
    const getWords = () => {
      axios.get(azure_url)
        .then(res => {
          setWords(res.data.reverse())
          setIsNewData(false)
          setIsLoaded(true)
        })
        .catch(err => {
          console.log('Error: ' + err);
          showToast('error','Something went wrong!','Error: ' + err)
        });
    }

    getWords();
  }, [isNewData]);

  const [filters, setFilters] = useState({
    global: {value: null, matchMode: FilterMatchMode.CONTAINS}
  });

  const addWordCard = (e) => {
    const newCard = {
      "id": null,
      "pl": '',
      "en": '',
      "de": '',
      "it": '',
      "es": '',
      "sentence_pl": '',
      "sentence_en": '',
      "sentence_de": '',
      "sentence_it": '',
      "sentence_es": '',
      "date_ola": null,
      "date_rol": null,
      "hint_pl": '',
      "hint_en": '',
      "hint_de": '',
      "hint_it": '',
      "hint_es": '',
      "rank_ola": '',
      "rank_rol": ''
    }
    setWords([newCard, ...words])
  }

  const header = () => {
    return (
      <div className="card flex flex-column md:flex-row gap-3">
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-search" ></i>
          </span>
          <InputText 
            style={{ fontSize: '1.5rem' }}
            onInput={(e) => setFilters({
              global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS}
            })}
          />
        </div>
        <div className="p-inputgroup flex-1">
          <Button label="Add new card!" onClick={addWordCard}/>
        </div>
      </div>
    )
    

  }

  const editCard = (e) => {
    setIsLoaded(false)
    // console.log(e.data) // stare dane
    // console.log(e.newData) // nowe dane
    axios.put(azure_url, e.newData)
      .then(res => {
        setIsNewData(true)
      })
      .catch(err => {
        console.log('Error: ' + err);
        showToast('error','Something went wrong!','Try again later.')
      });
  };

  const textEditor = (options) => {
    return (
      <InputText
          type="text"
          value={options.value}
          onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  if (isLoaded) {
    return (
      <PrimeReactProvider>
        <DataTable value={words} dataKey="id" editMode='row' onRowEditComplete={editCard} filters={filters} header={header} emptyMessage="Loading..." paginator rows={10} rowsPerPageOptions={[10, 20, 50, 100]} tableStyle={{ minWidth: '50rem' }}>
          <Column rowEditor={true} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
          <Column field="id" header="id"  style={{ width: '2%' }}></Column>
          <Column field="pl" header="pl" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="en" header="en" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="de" header="de" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="it" header="it" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="es" header="es" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="hint_pl" header="hint_pl" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="hint_en" header="hint_en" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="hint_de" header="hint_de" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="hint_it" header="hint_it" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="hint_es" header="hint_es" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="sentence_pl" header="sentence_pl" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="sentence_en" header="sentence_en" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="sentence_de" header="sentence_de" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="sentence_it" header="sentence_it" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
          <Column field="sentence_es" header="sentence_es" editor={(options) => textEditor(options)} style={{ width: '9%' }}></Column>
        </DataTable>
        <Toast ref={myToast} /> 
      </PrimeReactProvider>
    );
  } else {
    return <div><LoadingPage /><Toast ref={myToast} /></div>
  }

}

export default WordsTable;
