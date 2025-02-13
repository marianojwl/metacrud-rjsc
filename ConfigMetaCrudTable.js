import React from 'react'
import useApi from './useApi';
import {MetaCrudContext} from './MetaCrud'
import Loading from './Loading';


function ConfigMetaCrudTable() {
  const { table_data_hook, setSection, tablename, api_url} = React.useContext(MetaCrudContext);

  const [json, setJson] = React.useState(JSON.stringify(table_data_hook?.response?.data?.Comment?.metacrud??{} ));

  const handleChage = (e) => {
    setJson(e.target.value);
  }

  const reloadTableData = React.useCallback((response) => { 
    if(response?.success) {
      table_data_hook.get('', [(r) => { setSection('read'); }]);
    }
  }, []);

  const table_comment_hook = useApi(api_url + '/meta/' + tablename + '/setTableComment', '', false, [], reloadTableData);

  const handleGuardar = (e) => {
    try {
      const j = JSON.parse(json);
      table_comment_hook?.post({Comment: JSON.stringify({metacrud:j})});
    } catch (error) {
      alert('JSON no válido');
      return;
    }
  }

  return ( table_data_hook?.loading ? <Loading /> :
    !table_data_hook?.response?.data ? null : 
    <div>
      <textarea 
        className='form-control'
        value={json}
        onChange={handleChage}
        rows={4}
        cols={40}
        />
        {
          table_comment_hook?.loading ? <Loading /> :
          <button
            onClick={handleGuardar}
            className={'d-inline-flex mt-2 btn btn-'+('primary')}
            >Guardar</button>
        }
        <div className='ms-2 d-inline-flex bagde badge-info'>{json?.length}/2048</div>
    </div>
  )
}

export default ConfigMetaCrudTable