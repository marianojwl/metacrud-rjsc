import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import useApi from './useApi';
import Loading from './Loading';

function Select({column, data, onChange, disabled, isValid, autoFocus=false}) {

  const {restrictions, section, tablename, api_url} = React.useContext(MetaCrudContext);

  const metacrud = column?.Comment?.metacrud;

  const [kCol, kTab, kDb] = metacrud?.foreign_key.split('.').reverse();
  const [vCol, vTab, vDb] = metacrud?.foreign_value.split('.').reverse();

  const options_hook = useApi(api_url + '/crud/' + (kDb?kDb+'.':'') + kTab + '?limit=1000&sort='+vCol+'&cols[]='+kCol+'&cols[]='+vCol, '', true);

  return ( options_hook?.loading ? <Loading /> :
    <select 
      className={'form-select'+(disabled?'':(metacrud?.regex_pattern?(isValid?' is-valid':' is-invalid'):''))}
      disabled={disabled}
      name={column.Field} 
      value={data[column.Field]} 
      autoFocus={autoFocus}
      onChange={onChange}>
      <option value=''>Seleccione...</option>
      {
        options_hook?.response?.data?.rows?.filter(option => !restrictions?.[section] || !restrictions?.[section]?.[column.Field] || restrictions?.[section]?.[column.Field]?.includes(option[kCol]))?.map((option, i) => <option key={i} value={option[kCol]}>{option[vCol]}</option>)
      }
  </select>
  )
}

export default Select