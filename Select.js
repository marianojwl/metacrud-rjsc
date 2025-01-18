import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import useApi from './useApi';

function Select({column, data, onChange, disabled, isValid}) {

  const {tablename, api_url} = React.useContext(MetaCrudContext);

  const metacrud = column?.Comment?.metacrud;

  const [kCol, kTab, kDb] = metacrud?.foreign_key.split('.').reverse();
  const [vCol, vTab, vDb] = metacrud?.foreign_value.split('.').reverse();

  const options_hook = useApi(api_url + '/crud/' + (kDb?kDb+'.':'') + kTab + '?limit=1000&sort='+vCol+'&cols[]='+kCol+'&cols[]='+vCol, '', true);

  return ( options_hook?.loading ? <div className='spinner-border spinner-border-sm text-primary'></div> :
    <select 
      className={'form-select'+(disabled?'':(metacrud?.regex_pattern?(isValid?' is-valid':' is-invalid'):''))}
      disabled={disabled}
      name={column.Field} 
      value={data[column.Field]} 
      onChange={onChange}>
      <option value=''>Seleccione...</option>
      {
        options_hook?.response?.data?.map((option, i) => <option key={i} value={option[kCol]}>{option[vCol]}</option>)
      }
  </select>
  )
}

export default Select