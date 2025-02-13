import React from 'react'
import Loading from './Loading'
import {MetaCrudContext} from './MetaCrud'
import ConfigMetaCrudColumn from './ConfigMetaCrudColumn';
import ConfigMetaCrudTable from './ConfigMetaCrudTable';

function Config() {
  const {columns_data_hook} = React.useContext(MetaCrudContext);
  const columns = columns_data_hook?.response?.data;
  const [columnsMetacrud, setColumnsMetacrud] = React.useState(columns?.map(column => ({[column.Field]: column?.Comment?.metacrud}))?.reduce((acc, column) => ({...acc, ...column}), {}));

  
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    const [Field, key] = name.split('|');
    
    setColumnsMetacrud(prev=> ({
      ...prev,
      [Field]: {
        ...prev[Field],
        [key]: value === "" ? undefined : value
      }
    }));
  
  }
  const handleStringSelectChange = (e) => {
    const {name, value} = e.target;
    const [Field, key] = name.split('|');
    
    setColumnsMetacrud(prev=> ({
      ...prev,
      [Field]: {
        ...prev[Field],
        [key]: value === "" ? undefined : value
      }
    }));
  }

  const handleValueSelectChange = (e) => {
    const {name, value} = e.target;
    const [Field, key] = name.split('|');
    
    setColumnsMetacrud(prev=> { 
      let object;
      try {
        object = JSON.parse(value);
      } catch (error) {
        object = null;
      }
      return({
      ...prev,
      [Field]: {
        ...prev[Field],
        [key]: value === "" ? undefined : object
      }
    })});
  }

  const properties = {
    "label":{},
    "foreign_key":{},
    "foreign_value":{},
    "hidden":{
      "onChange": handleValueSelectChange,
      "options": [
        {"label":"True", "value":true},
        {"label":"False", "value":false},
      ]
    },
    "regex_pattern":{
      "onChange": handleStringSelectChange,
      "options": [
        {"label":"Fecha", "value":"^\\d{4}-\\d{2}-\\d{2}$"},
        {"label":"UnoCero", "value":"^\\d{1,10}$"},
      ]
    },
    "allowEditInTable":{
    },
  };


  return ( columns_data_hook?.loading ? <Loading /> :
    <div>
      <ConfigMetaCrudTable />
      <table className='table table-striped table-hover'>
        <thead>
          <tr>
            <th>Columna</th>
            <th>Metacrud</th>
          {
            Object.keys(properties).map((key, i) => {
              return (
                <th key={i}>{key}</th>
              )
            })
          }
          </tr>
        </thead>
        <tbody>
      {
        columns?.map((column, i) => {
          return (
            <tr key={i}>
              <td>{column.Field}</td>
              <td>
                <ConfigMetaCrudColumn column={column} columnsMetacrud={columnsMetacrud} />
              </td>
              {
                Object.keys(properties).map((key, j) => {
                  return (
                    <td key={j}>
                      {
                        properties[key]?.options ? 
                        <select 
                          onChange={properties[key]?.onChange??handleInputChange}
                          className='form-select' 
                          name={column.Field+"|"+key} 
                          value={columnsMetacrud[column.Field]?.[key]} 
                          autoFocus={false}>
                          <option value=''></option>
                          {
                            properties[key]?.options.map((option, k) => <option key={k} value={option.value}>{option.label}</option>)
                          }
                        </select>
                        :
                        <input 
                          className='form-control'
                          type='text'
                          name={column.Field+"|"+key} 
                          value={columnsMetacrud[column.Field]?.[key]}
                          onChange={properties[key]?.onChange??handleInputChange}
                          autoFocus={false} />
                      }
                    </td>
                  )
                })
              }
              
            </tr>
          )
        })
      }
        </tbody>
      </table>
    </div>
  )
}

export default Config