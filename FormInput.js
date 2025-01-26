import React from 'react'
import Select from './Select'


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

    switch(elem){
      case 'select':
        return (<div key={key} className='form-group mb-1'>
          { showLabel && <label>{metacrud?.label??column?.Field}</label> }
          <Select autoFocus={autoFocus} column={column} data={data} onChange={onChange} disabled={disabled} isValid={isValid} />
        </div>);
        break;
      default:
        return (<div key={key} className='form-group mb-1'>
          { showLabel && <label>{metacrud?.label??column?.Field}</label> }
          <input 
            className={'form-control'+(disabled?'':(metacrud?.regex_pattern?(isValid?' is-valid':' is-invalid'):''))}
            disabled={disabled}
            type={metacrud?.inputType??inputType(type)} 
            maxLength={lenght}
            name={column.Field} 
            value={data[column.Field]} 
            onChange={onChange}
            autoFocus={autoFocus} />
        </div>);
        break;

    }
  };


  return inputElement(column, i,  enabled);
}

export default FormInput