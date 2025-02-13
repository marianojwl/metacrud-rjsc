import React from 'react'
import useApi from './useApi';
import {MetaCrudContext} from './MetaCrud'
import Loading from './Loading';

function ConfigMetaCrudColumn({column, columnsMetacrud}) {
  const metacrudObj = columnsMetacrud[column?.Field];
  const json = JSON.stringify(metacrudObj);
  const [originalJson, setOriginalJson] = React.useState(JSON.stringify(metacrudObj));

  const { setSection, tablename, api_url, columns_data_hook } = React.useContext(MetaCrudContext);

  const reloadColumns = React.useCallback((response) => { 
    if(response?.success) {
      columns_data_hook.get('', [(r) => { setSection('read'); }]);
    }
  }, []);


  const column_comment_hook = useApi(api_url + '/meta/' + tablename + '/column', '', false, [], reloadColumns);

  const handleGuardar = (e) => {
    column_comment_hook?.post({Comment: JSON.stringify({metacrud:metacrudObj}), Field: column?.Field});
  }
  return (
    <div>
      <textarea 
        className='form-control'
        disabled={true}
        value={json}
        rows={4}
        cols={40}
        />
        {
          column_comment_hook?.loading ? <Loading /> :
          <button
            disabled={json === originalJson}
            onClick={handleGuardar}
            className={'mt-2 btn btn-'+(json === originalJson ? 'secondary' : 'primary')}
            >Guardar</button>
        }
    </div>
  )
}

export default ConfigMetaCrudColumn