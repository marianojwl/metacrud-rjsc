import React, { useEffect } from 'react'
import { MetaCrudContext } from './MetaCrud'
import Select from './Select';
import useApi from './useApi';
import Loading from './Loading';


function FieldSelector(props) {
  const { columns, mapKey, mapFrom, mapTo, handleClickOnColumn, selectedClassName } = props;

  const filteredColumns = columns?.
                          filter(column => {
                            if(mapKey==='mapFrom'){
                              return !mapTo?.Field || column?.Field !== mapTo?.Field;
                            }
                            if(mapKey==='mapTo'){
                              return !mapFrom?.Field || column?.Field !== mapFrom?.Field;
                            }
                            return true;
                          });

  return(
    <div className='FieldSelector input-group mb-3'>
      <label className='input-group-text'><span className="material-symbols-outlined">{mapKey==='mapFrom'?'line_start_square':'polyline'}</span></label>
      <select className='form-select' onChange={(e)=>handleClickOnColumn(columns.find(column => column.Field === e.target.value))}>
        <option value=''>Seleccione...</option>
        {
          filteredColumns?.
          map((column, i) => {
            const cmc = column?.Comment?.metacrud;
            return (
            <option key={'FieldSelector-'+i} value={column.Field}>{cmc?.label??column.Field}</option>
          )})
        }
      </select>
  </div>
  );
}



// *********************************************

function Mapping({mapFrom, mapTo, data}) {

  const { tablename, table_meta, api_url, primaryKeyName } = React.useContext(MetaCrudContext);
  
  const mapToMC = mapTo?.Comment?.metacrud;

  const [kCol, kTab, kDb] = mapToMC?.foreign_key ? mapToMC?.foreign_key?.split('.').reverse() : [mapTo?.Field, mapToMC.table??"", mapToMC?.database??""];
  const [vCol, vTab, vDb] = mapToMC?.foreign_value ? mapToMC?.foreign_value?.split('.').reverse() : [mapTo?.Field, mapToMC?.table??"", mapToMC?.database??""];

  const mapFromField = mapFrom?.Field;

  const recordsView = table_meta?.relate?.[tablename]?.view??null;

  const recordsGroupBy = table_meta?.relate?.[tablename]?.groupBy??null;

  const mapped_records_hook = useApi(api_url + '/crud/' + tablename + '?limit=1000&' + mapFromField + '[]=' + data[mapFromField] + (recordsView?('&metacrudView='+recordsView):('&cols[]=' + mapTo.Field + '&cols[]=' + primaryKeyName)), '', true, [data[mapFromField]]);

  const mapped_records = mapped_records_hook?.response?.data?.rows?.map(r=>({...r, checked:true}));

  const relate_hook = useApi(api_url + '/crud/' + tablename, '', false, []);

  const optionsView = table_meta?.relate?.[(kDb?kDb+'.':'') + kTab]?.view??null;

  const optionsGroupBy = table_meta?.relate?.[(kDb?kDb+'.':'') + kTab]?.groupBy??null;

  const options_hook = useApi(api_url + '/crud/' + (kDb?kDb+'.':'') + kTab + '?distinct=true&limit=1000&sort='+vCol+(optionsView?('&metacrudView='+optionsView):('&cols[]='+kCol+'&cols[]='+vCol)), '', true, [mapTo.Field]);
  
  const options = options_hook?.response?.data?.rows;

  const records_values = mapped_records?.map(record => record[mapTo.Field]);

  const unCheckedOptions = options_hook?.response?.data?.rows?.filter(option => !records_values?.includes(option[kCol]));



  const uncheckHandler = (obj) => {
    relate_hook.del([obj],[(r)=>{if(r?.success) mapped_records_hook.get()}]);
  };

  const checkHandler = (obj) => {
    relate_hook.post(obj,[(r)=>{if(r?.success) mapped_records_hook.get()}]);
  };

  const guardando = relate_hook?.loading || mapped_records_hook?.loading || options_hook?.loading;

  return ( 
    ( mapped_records_hook?.loading && !mapped_records_hook?.response?.data) ? <Loading legend='Cargando registros...' /> :
    (options_hook?.loading && !options_hook?.response?.data) ? <Loading legend='Cargando Opciones...' /> :
    <div className='Mapping'>
      <ul className='list-group'>
      {
        options?.
        map(rec=>rec[recordsGroupBy])?.
        filter((v, i, a) => a.indexOf(v) === i)?.
        sort((a, b) => a.localeCompare(b))?.
        map((group, i) =>
          <div key={'checkedGroup-'+i} className='mt-3 mb-1'>
            <h6>{group}</h6>
            {
              // MAPED RECORDS (CHECKED)
              mapped_records?.
              filter(rec=>rec[recordsGroupBy]===group)?.
              sort((a, b) => a[mapToMC?.foreign_value?.replace('.','_')]?.localeCompare(b[mapToMC?.foreign_value?.replace('.','_')]))?.
              map((option, i) => {
                return (
                <li className='list-group-item' key={'ch-'+i}>
                  <div className='form-check'>
                    {guardando ? <Loading /> :
                    <input type='checkbox' className='form-check-input' readOnly={true} checked={option?.checked} onClick={()=>uncheckHandler({[primaryKeyName]:option[primaryKeyName]})} />
                    }
                    <label className='form-check-label'>{option[mapToMC?.foreign_value?.replace('.','_')]}</label>
                  </div>
                </li>);
              })
            }

            { optionsGroupBy === recordsGroupBy &&
              // UNMAPED RECORDS (UNCHECKED)
              unCheckedOptions?.
              filter(option => option[optionsGroupBy]===group)?.
              map((option, i) => {
                return (
                <li className='list-group-item' key={'unch-'+i}>
                  <div className='form-check'>
                    { guardando ? <Loading /> :
                    <input type='checkbox' className='form-check-input' readOnly={true} checked={false} onClick={()=>checkHandler({[mapFrom.Field]: data[mapFrom.Field], [mapTo.Field]: option[kCol]})} />
                    }
                    <label className='form-check-label'>{option[vCol]}</label>
                  </div>
                </li>);
              })
            }

            
          </div>
        )
      }

      {
        optionsGroupBy !== recordsGroupBy &&
        unCheckedOptions?.
        map(op=>op[optionsGroupBy])?.
        filter((v, i, a) => a.indexOf(v) === i)?.
        sort((a, b) => a.localeCompare(b))?.
        map((group, i) => 
          <div key={'group-'+i} className='mt-3 mb-1'>
            <h6>{group}</h6>
            {
              unCheckedOptions?.
              filter(option => option[optionsGroupBy]===group)?.
              map((option, i) => {
                return (
                <li className='list-group-item' key={'unch-'+i}>
                  <div className='form-check'>
                    { guardando ? <Loading /> :
                    <input type='checkbox' className='form-check-input' readOnly={true} checked={false} onClick={()=>checkHandler({[mapFrom.Field]: data[mapFrom.Field], [mapTo.Field]: option[kCol]})} />
                    }
                    <label className='form-check-label'>{option[vCol]}</label>
                  </div>
                </li>);
              })
            }
          </div>
        )
      }
      </ul>
      {/* <SelectMultiple column={mapTo} data={data} mapKey="mapTo" mapFrom={mapFrom} mapTo={mapTo} onChange={onCheckboxChange} selected={selected} /> */}
    </div>
  )
}


// *********************************************

function Relate() {

  const { columns_data_hook, primaryKeyName } = React.useContext(MetaCrudContext);
  const columns = columns_data_hook?.response?.data?.filter(column => column?.Comment?.metacrud?.foreign_key);

  const [mapFrom, setMapFrom] = React.useState(null);
  const [mapTo, setMapTo] = React.useState(null);

  const [data, setData] = React.useState({});


  const onChange = (e) => {
    setData({...data, [e.target.name]: (e.target.value==='')?
      ( columns?.find(column => column.Field === e.target.name)?.Null==='YES'?null:'' )
      : e.target.value
    });
  };

  return (
    <div className='Relate mt-1'>
      <div className='row'>
        <div className='col-sm-6'>
          <FieldSelector 
            columns={columns} 
            mapKey="mapFrom" 
            mapFrom={mapFrom} 
            mapTo={mapTo} 
            handleClickOnColumn={setMapFrom} 
            selectedClassName="btn-success" 
          /> 
          
          {mapFrom && 
          <div className='input-group mb-3'>
            <label className='input-group-text'>{mapFrom?.Comment?.metacrud?.label??mapFrom?.Field}</label>
            <Select 
              key={'Select-'+mapFrom?.Field}
              column={mapFrom} 
              data={data} 
              onChange={onChange} 
              disabled={false} 
              isValid={true} />
          </div>
            
          }
        </div>

        <div className='col-sm-6'>
          <FieldSelector columns={columns} mapKey="mapTo" mapFrom={mapFrom} mapTo={mapTo} handleClickOnColumn={setMapTo} selectedClassName="btn-warning" />
          { (mapTo && mapFrom && data[mapFrom?.Field]) &&
            <Mapping mapFrom={mapFrom} mapTo={mapTo} data={data} setData={setData} />
          }
        </div>
        
      </div>
      
    </div>
  )
}

export default Relate