import React from 'react'
import Select from './Select'
import useApi from './useApi';
import {MetaCrudContext} from './MetaCrud';
import Loading from './Loading';

function HTMLEditore({name, value, onChange, disabled=false}) {
  const tabs = ['Preview', 'HTML'];
  const [tab, setTab] = React.useState(tabs[0]);
  return (//{element:
    <div className='form-group mb-1'>
      <div className='btn-group'>
        {tabs.map((t, i)=><button key={i} className={'btn btn-sm btn-'+(tab===t?'primary':'secondary')} onClick={()=>setTab(t)}>{t}</button>)}
      </div>
      <textarea 
        className='form-control'
        disabled={disabled}
        name={name} 
        value={value || ""} />
    </div>
);
}

function InputFileUploader({column, value, onChange}){

  const [fileSetted, setFileSetted] = React.useState(false);

  const {api_url, tablename} = React.useContext(MetaCrudContext);

  const meta = column?.Comment?.metacrud;

  const isMultiple = meta?.upload?.multiple;

  const callback = (response) => {
    console.log(response);
    if(response?.success){
      onChange({target:{name:column?.Field, value:response?.data?.join(',')}});
    } else {
      alert('Error al subir el archivo.' + response?.message + response?.error);
    };
  };

  const upload_hook = useApi(api_url + '/upload/' + tablename, '', false, [], callback);

  const postMultiPartForm = (e) => {
    e.preventDefault();
    const form = e?.target?.form;
    const formData = new FormData(form);
    upload_hook?.upload(formData);
  };

  return ( upload_hook?.loading ? <Loading /> :
    <div className='InputFileUploader'>
      <div className='form-group mb-1'>
        <label>{meta?.label??column?.Field}</label>
        { value 
        ? <div>
            <div className='input-group'>
            <input className='form-control' type='text' name={column?.Field} value={value} readOnly={true} />
            <button disabled={!value} className='btn btn-danger d-flex' onClick={(e)=>{e.preventDefault(); setFileSetted(false); onChange({target:{name:column?.Field, value:""}})}}><span className='material-symbols-outlined'>close</span></button>
          </div>
          {
            meta?.upload?.accept?.filter(a=>a.startsWith('image')).length > 0 &&
            <div className='mt-1'>
              <img src={'/'+value} alt={value} style={{maxWidth:'100%', maxHeight:'140px'}} />
            </div>
          }
        </div>
        :
        <form method="post" encType="multipart/form-data" onSubmit={(e)=>e.preventDefault()}>
          <div className='input-group mb-1'>
            <input 
              onChange={(e)=>setFileSetted(!!e.target.files.length)}
              name={column?.Field+(isMultiple?'[]':'')}
              type='file' 
              className='form-control' 
              accept={meta?.upload?.accept?.join(', ')??'image/*'} 
              multiple={isMultiple} />
              {
                fileSetted && 
                <input 
                  type='button'
                  className='btn btn-primary' 
                  value='Adjuntar' 
                  onClick={postMultiPartForm} />
              }
          </div>
          {
            (fileSetted && !value) &&
            <div className='my-2 alert alert-warning'>Presione "Adjuntar" para completar la carga. Y luego "Guardar".</div>
          }
        </form>
        }
        
      </div>

    </div>
  );
}

function FormInput({autoFocus=false, column, i, data, onChange, showLabel=true, enabled=true}) {
  const metacrud = column?.Comment?.metacrud;
  let [type, lenght] = column?.Type.split('(');
  if(lenght) lenght = lenght.slice(0, -1);

  // metacrud: { "regex_pattern": "^(true|false|1|0)$" }
  const regex = new RegExp(metacrud?.regex_pattern??'.*');

  const isValid = regex.test(data[column.Field]);

  const disabled = column?.Key === 'PRI';

  
  const inputType = (Type) => {
    switch(Type){
      case 'int': return 'number';
      case 'varchar': return 'text';
      case 'text': return 'text';
      case 'tinytext': return 'text';
      case 'date': return 'date';
      case 'datetime': return 'datetime-local';
      default: return 'text';
    }
  };

  const inputElement = (column, key, enabled) => {
    const metacrud = column?.Comment?.metacrud;
    let [type, lenght] = column?.Type.split('(');
    if(lenght) lenght = lenght.slice(0, -1);

    const regex = new RegExp(metacrud?.regex_pattern??'.*');
    const isValid = regex.test(data[column.Field]);
    const disabled = column?.Key === 'PRI' || !enabled;

    let elem = type;

    if(metacrud?.foreign_key && metacrud?.foreign_value) elem = 'select';

    if(metacrud?.upload) elem = 'file';

    //if(column?.Field?.endsWith('_HTML')) elem = 'HTML';

    switch(elem){
      // case 'HTML':
      //   const Wrapper = useHTMLEditore({name: column.Field, value: data[column.Field], onChange, disabled});
      //   return Wrapper.element;
      //     //return <HTMLEditore key={key} disabled={disabled} name={column.Field} value={data[column.Field] || ""} onChange={onChange} autoFocus={autoFocus} />
      //   break;
      case 'enum':
        return (
          <select className='form-select' key={key} name={column.Field} value={data[column.Field] || ""} onChange={onChange} disabled={disabled}>
            <option value=''>Seleccione...</option>
            {lenght?.split(',').map((option, i)=><option key={i} value={option.replace(/'/g,'')}>{option.replace(/'/g,'')}</option>)}
          </select>
        );
        break
      case 'file':
        return <InputFileUploader key={key} column={column} onChange={onChange} value={data[column?.Field] || ""}  />;
        break;
      case 'text':
      case 'tinytext':
        return (
          <div key={key} className='form-group mb-1'>
            { showLabel && <label>{metacrud?.label??column?.Field}</label> }
            { (showLabel && metacrud?.description) && <div><small>{metacrud?.description}</small></div> }
            <textarea 
              autoFocus={autoFocus}
              className={'form-control'+(disabled?'':(metacrud?.regex_pattern?(isValid?' is-valid':' is-invalid'):''))}
              disabled={disabled}
              rows={column?.Field?.endsWith('_HTML')?22:5}
              name={column.Field} 
              value={data[column.Field] || ""} 
              onChange={onChange} />
          </div>
        );
        break;
      case 'select':
        return (<div key={key} className='form-group mb-1'>
          { showLabel && <label>{metacrud?.label??column?.Field}</label> }
          <Select autoFocus={autoFocus} column={column} data={data} onChange={onChange} disabled={disabled} isValid={isValid} />
        </div>);
        break;
      case 'boolean':
      case 'tinyint':
        return (<div key={key} className='form-group mb-1'>
          { showLabel && <label>{metacrud?.label??column?.Field}</label> }
          { (showLabel && metacrud?.description) && <div><small>{metacrud?.description}</small></div> }
          <div className='form-check form-switch'>
          <input 
            className={'form-check-input'}
            disabled={disabled}
            type='checkbox' 
            name={column.Field} 
            checked={data[column.Field]==1 || false} 
            onChange={onChange} />
          </div>
        </div>);
        break;
      default:
        return (<div key={key} className='form-group mb-1'>
          { showLabel && <label>{metacrud?.label??column?.Field}</label> }
          { (showLabel && metacrud?.description) && <div><small>{metacrud?.description}</small></div> }
          <input 
            className={'form-control'+(disabled?'':(metacrud?.regex_pattern?(isValid?' is-valid':' is-invalid'):''))}
            disabled={disabled}
            type={metacrud?.inputType??inputType(type)} 
            maxLength={lenght}
            name={column.Field} 
            value={data[column.Field] || ""}
            onChange={onChange}
            autoFocus={autoFocus}
            onFocus={(e)=>{e.target.select();}}
            />
        </div>);
        break;

    }
  };


  return inputElement(column, i,  enabled); // column?.Field?.endsWith('_HTML') ? <HTMLEditore key={i} disabled={!enabled} name={column.Field} value={data[column.Field] || ""} onChange={onChange} /> :
  
}

export default FormInput