import React from 'react'
import FormInput from './FormInput'
import {MetaCrudContext} from './MetaCrud'
import useApi from './useApi';
import Loading from './Loading';

function TableCellForm({column, i, record, recordKey, apiCallback, enabled, setEnabled}) {
  
  const {tablename, primaryKeyName, api_url} = React.useContext(MetaCrudContext);
  const metacrud = column?.Comment?.metacrud;

  const callback = React.useCallback((r) => {
    setEnabled(false);
    apiCallback(r);
  }, []);

  const post_hook = useApi(api_url + '/crud/' + tablename, '', false, [], callback);
  
  const [value, setValue] = React.useState(record[column.Field]);

  const onChange = (e) => {
    setValue(e.target.value);
  }
  
  const handleGuardar = (e) => {
    e.preventDefault();
    post_hook.put({[primaryKeyName]:record[primaryKeyName], [column.Field]: value});
  }
  return ( post_hook?.loading ? <Loading /> : 
    <div className=''>
      { enabled && <form onSubmit={handleGuardar}>
        <FormInput autoFocus={true} enabled={enabled} showLabel={false} column={column} i={i} data={{[primaryKeyName]:record[primaryKeyName], [column.Field]: value}} onChange={onChange} />
      </form>
      }
      { enabled && <>
      <button className='btn btn-sm d-inline-block w-auto' onClick={handleGuardar}>
        <span className="material-symbols-outlined">save</span>
      </button>
      <button className='btn btn-sm w-auto d-inline-block' onClick={()=>setEnabled(prev=>!prev)}>
        <span className="material-symbols-outlined">{enabled?'cancel':'edit'}</span>
      </button>
      </>}
    </div>
  )
}

export default TableCellForm