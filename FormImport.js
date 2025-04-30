import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import useApi from './useApi';
import Loading from './Loading';

function FormImport() {
  const { table_data_hook, api_url, tablename } = React.useContext(MetaCrudContext);

  const callback = (response) => {
  };

  const instructions = table_data_hook?.response?.data?.Comment?.metacrud?.import?.instructions;

  const import_hook = useApi(api_url + '/import/' + tablename, '', false, [], callback);

  const postMultiPartForm = (e) => {
    e.preventDefault();
    const form = e?.target?.form;
    const formData = new FormData(form);
    import_hook?.upload(formData);
  };

  const [isFileSelected, setIsFileSelected] = React.useState(false);
  return (
    <div className='FormImport'>
      <h2>Importar Datos</h2>
      <h3>Indicaciones</h3>
      <ol>
        {
          instructions?.map((instruction, index) => (
            <li key={index}>
              {instruction}
            </li>
          ))
        }
      </ol>
      <h3>Archivo</h3>
      {
        import_hook?.loading ? <Loading legend='Importando...' /> : 
        <div>
        {
          import_hook?.response &&
          <div key={import_hook?.response?.message} className={'my-1 px-2 py-1 mb-2 alert alert-'+(import_hook?.response?.success?'success':'warning')}>
            {import_hook?.response?.success ? 'Importación exitosa' : 'No se pudo completar la importación'}. {import_hook?.response?.message}. {import_hook?.response?.error}.
          </div>
        }
        <form className='mb-2' encType="multipart/form-data" method="post"  onSubmit={(e)=>e.preventDefault()}>
          <input multiple={true} name="datafile[]" className='form-control mb-2' type="file" accept=".xls" onChange={(e) => setIsFileSelected(e?.target?.files?.length > 0)} />
          <button onClickCapture={postMultiPartForm} className='btn btn-primary' disabled={!isFileSelected} onClick={() => {}}>Importar</button>
        </form>
        </div>
      }

    </div>
  )
}

export default FormImport