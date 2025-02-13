import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import useApi from './useApi';
import Select from './Select';
import FormInput from './FormInput';

function Form() {

  const { restrictions, createCallbacks, updateCallbacks, setLastResult, setSection, apiCallback, api_url, tablename, selectedRows, section, columns_data_hook, records_data_hook}  = React.useContext(MetaCrudContext);
  
  const editing_rercord_id = selectedRows[0]??null;

  const record_hook = useApi(api_url + '/crud/' + tablename + '/' + editing_rercord_id, '', section==='update');

  const post_hook = useApi(api_url + '/crud/' + tablename, '', false, [], apiCallback);

  const columns = columns_data_hook?.response?.data?.sort((a, b) => b?.Comment?.metacrud?.order??0 - a?.Comment?.metacrud?.order??0)??[];

  const [data, setData] = React.useState({});

  const [formResult, setFormResult] = React.useState(null);

  React.useEffect(() => {
    if(section !== 'update') return;
    setData(record_hook?.response?.data?.rows[0]??{});
  }, [record_hook?.response?.data, section]);
  

  const onChange = (e) => {
    setData({...data, [e.target.name]: e.target.value});
  };

  const inputType = (Type) => {
    switch(Type){
      case 'int': return 'number';
      case 'varchar': return 'text';
      case 'text': return 'text';
      case 'date': return 'date';
      case 'datetime': return 'datetime-local';
      default: return 'text';
    }
  };

  const inputElement = (column, key) => {
    const metacrud = column?.Comment?.metacrud;
    let [type, lenght] = column?.Type.split('(');
    if(lenght) lenght = lenght.slice(0, -1);

    const regex = new RegExp(metacrud?.regex_pattern??'.*');
    const isValid = regex.test(data[column.Field]);
    const disabled = column?.Key === 'PRI';

    let elem = type;

    if(metacrud?.foreign_key && metacrud?.foreign_value) elem = 'select';

    switch(elem){
      case 'select':
        return (<div key={key} className='form-group mb-1'>
          <label>{metacrud?.label??column?.Field}</label>
          <Select column={column} data={data} onChange={onChange} disabled={disabled} isValid={isValid} />
        </div>);
        break;
      default:
        return (<div key={key} className='form-group mb-1'>
          <label>{metacrud?.label??column?.Field}</label>
          <input 
            className={'form-control'+(disabled?'':(metacrud?.regex_pattern?(isValid?' is-valid':' is-invalid'):''))}
            disabled={disabled}
            type={metacrud?.inputType??inputType(type)} 
            maxLength={lenght}
            name={column.Field} 
            value={data[column.Field] || ''}
            onChange={onChange} />
        </div>);
        break;

    }
  };

  const reEnableButton = (e, label='Guardar') => {
    e.target.disabled = false;
    e.target.innerText = label;
  }

  const handleGuardar = (e) => {
    e.preventDefault();
    e.target.disabled = true;
    e.target.innerText = '...';

    if(section === 'create') {
      post_hook.post(data, [
        (json) => { if(!json?.success) { reEnableButton(e); setFormResult(json); } },
        ...createCallbacks
      ]);
    }

    if(section === 'update') {
      post_hook.put(data, updateCallbacks);
    }

  }

  return ( (section === 'update' && record_hook?.loading) ? <div className='spinner-border spinner-border-sm text-primary'></div> :
    <div className='MetaCrudForm'>
      { formResult && (formResult?.message || formResult?.error) &&
        <div className={'my-1 px-2 py-1 alert alert-'+(formResult?.success?'success':'warning')}>
          {formResult?.message} {formResult?.error}
        </div>
      }
      <form disabled={post_hook?.loading} onSubmit={handleGuardar}>
      {
        columns?.map((column, i) => {
          return (
            <FormInput key={"FormInput-"+i} i={i} column={column} data={data} onChange={onChange} />
          )
          /*
          const metacrud = column?.Comment?.metacrud;
          let [type, lenght] = column?.Type.split('(');
          if(lenght) lenght = lenght.slice(0, -1);

          // metacrud: { "regex_pattern": "^(true|false|1|0)$" }
          const regex = new RegExp(metacrud?.regex_pattern??'.*');

          const isValid = regex.test(data[column.Field]);

          const disabled = column?.Key === 'PRI';

          return inputElement(column, i);
          */
      })
      }
      <button className='btn btn-primary mt-2 me-2' onClick={handleGuardar}>Guardar</button>
      <button className='btn btn-secondary mt-2' onClick={()=>setSection('read')}>Cancelar</button>
    </form>
    </div>
  )
}

export default Form