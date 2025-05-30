import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import useApi from './useApi';
import Loading from './Loading';

function SelectMultiple({column, data, onChange, disabled, isValid, autoFocus=false}) {

  const {restrictions, section, tablename, api_url} = React.useContext(MetaCrudContext);

  const metacrud = column?.Comment?.metacrud;

  const [kCol, kTab, kDb] = metacrud?.foreign_key?.split('.')?.reverse();
  const [vCol, vTab, vDb] = metacrud?.foreign_value?.split('.')?.reverse();

  const options_hook = useApi(api_url + '/crud/' + (kDb?kDb+'.':'') + kTab + '?limit=1000&sort='+vCol+'&cols[]='+kCol+'&cols[]='+vCol, '', true);

  const onChangeAll = (e) => {
    if (e.target.checked) {
      onChange({target: {name: column.Field, value: options_hook?.response?.data?.rows?.map(option => Number.parseInt(option[kCol]))}})
    } else {
      onChange({target: {name: column.Field, value: []}})
    }
  }

  return ( options_hook?.loading ? <Loading /> :
    <div 
      className="SelectMultiple">
        <div className='form-check d-inline-flex w-auto me-3'>
          <input type='checkbox' value="" className='form-check-input' onChange={onChangeAll} checked={data[column.Field]?.length === options_hook?.response?.data?.rows?.length} />
          <label className='ms-2 form-check-label'>Todos</label>
        </div>
      {
        options_hook?.response?.data?.rows?.filter(option => !restrictions?.[section] || !restrictions?.[section]?.[column.Field] || restrictions?.[section]?.[column.Field]?.includes(option[kCol]))?.map((option, i) => 
          <div key={i} className='form-check d-inline-flex w-auto me-3'>
            <input type='checkbox' value={option[kCol]} className='form-check-input' 
              checked={data[column.Field]?.includes(Number.parseInt(option[kCol]))} 
              onChange={(e) => {
                if (e.target.checked) {
                  onChange({target: {name: column.Field, value: [...(data[column.Field]??[]), Number.parseInt(e.target.value)]}})
                } else {
                  onChange({target: {name: column.Field, value: data[column.Field]?.filter(v => v !== Number.parseInt(e.target.value))}})
                }
              }
              }
              />

            <label className='ms-2 form-check-label'>{option[vCol]}</label>
          </div>
        )
      }
  </div>
  )
}

export default SelectMultiple
/*
import React from 'react'
import Loading from './Loading';
import useApi from './useApi';
import {MetaCrudContext} from './MetaCrud';

function SelectMultiple({column, disabled=false}) {

  const filterInputTextRef = React.useRef(null);

  const autoFocusCallback = () => filterInputTextRef.current?.focus();

  const [textFilter, setTextFilter] = React.useState('');

  const {api_url, filters, setFilters} = React.useContext(MetaCrudContext);

  const metacrud = column?.Comment?.metacrud;

  const [kCol, kTab, kDb] = metacrud?.foreign_key ? metacrud?.foreign_key?.split('.').reverse() : [column?.Field, column?.Comment?.metacrud?.table??"", column?.Comment?.metacrud?.database??""];
  const [vCol, vTab, vDb] = metacrud?.foreign_value ? metacrud?.foreign_value?.split('.').reverse() : [column?.Field, column?.Comment?.metacrud?.table??"", column?.Comment?.metacrud?.database??""];

  const options_hook = useApi(api_url + '/crud/' + (kDb?kDb+'.':'') + kTab + '?distinct=true&limit=1000&sort='+vCol+'&cols[]='+kCol+'&cols[]='+vCol, '', false);

  const options = options_hook?.response?.data?.rows || [];

  const [selected, setSelected] = React.useState(filters?.[column?.Field] || []);

  const handleApply = () => {
    if(selected?.length && selected?.length < options?.length) {
      setFilters({...filters, [column?.Field]: selected});
    } else {
      setFilters({...filters, [column?.Field]: null});
    }
  };

  const handleFilterOff = () => {
    setFilters({...filters, [column?.Field]: null});
  };

  const handleChange = (e) => {
    if (e.target.checked) {
      setSelected([...selected, (column?.Type?.includes('int')?parseInt(e.target.value):e.target.value)])
    } else {
      setSelected(selected.filter(v => v !== e.target.value))
    }
  }

  const handleToggleAll = (e) => {
    if (e.target.checked) {
      setSelected(options?.filter(option=>option[kCol]).map(option => option[kCol]))
    } else {
      setSelected([])
    }
  }

  const handleOpen = (e) => {
    if(!options?.length && !disabled) options_hook.get();
    autoFocusCallback();
  }

  const optionsDisplaying = options?.filter(option => option[vCol].toLowerCase().includes(textFilter.toLowerCase()));

  
  const handleTextFilterEnter = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      const selected = optionsDisplaying?.filter(option => option[vCol].toLowerCase().includes(textFilter.toLowerCase()))?.filter(option => option[kCol]!="" && option[kCol]!=null)?.map(option => option[kCol]);
      if(selected?.length && selected?.length < options?.length) {
        setFilters({...filters, [column?.Field]: selected});
      } else {
        setFilters({...filters, [column?.Field]: null});
      }
    }
  }

  return ( 
    <div className='dropdown d-inline-block'>
      <a onClick={handleOpen} className={'btn rounded-0 border-0 py-0 px-0 ms-2 mt-1'+(disabled?' text-muted':' dropdown-toggle')} href={disabled?null:'#'}  role='button' id='dropdownMenuLink' data-bs-toggle={disabled?'':'dropdown'} aria-expanded='false' style={{cursor: disabled?'not-allowed':'pointer'}}>
        <span className={'material-symbols-outlined'+(filters?.[column?.Field]?.length?' text-primary':'')}>filter_list</span>
        { filters?.[column?.Field]?.length ?
        <span className="position-absolute top-0 start-50  badge rounded-pill bg-danger">
          {filters?.[column?.Field]?.length}
        </span>
        : null}
      </a>
      <div aria-labelledby='dropdownMenuLink' className='border border-top border-bottom border-tertiary dropdown-menu rounded-0 border-0 shadow p-0'>
        <div className='px-1 py-2 shadow-sm p-0 me-2 d-flex'>
          <button className='btn btn-sm' onClick={handleApply}>
            <span className='material-symbols-outlined text-primary'>check_circle</span>
          </button>
          <button className='btn btn-sm p-0 me-3' onClick={handleFilterOff}>
            <span className='material-symbols-outlined text-muted'>filter_list_off</span>
          </button>
          <input type='text' className='form-control form-control-sm' style={{minWidth:"7rem"}} placeholder='Filtrar...' value={textFilter} onChange={(e) => setTextFilter(e.target.value)} ref={filterInputTextRef} onKeyPress={handleTextFilterEnter} />
        </div>
        <ul className='pt-0 px-3 pb-0 scrollable-menu m-0' style={{maxHeight:'50vh', overflowY:'auto'}} onClick={(e) => e.stopPropagation()}  >
          {
            (options_hook?.loading || !column) ? <Loading /> :
            optionsDisplaying?.map((option, i) => 
              <li key={i} className='my-2 form-check fw-normal'>
                <input id={"ch-"+column?.Field+"-"+i} className='form-check-input' type='checkbox' value={option[kCol]} onChange={handleChange} checked={selected.includes(option[kCol])} disabled={!option[kCol]??null} />
                <label htmlFor={"ch-"+column?.Field+"-"+i}  className='form-check-label'>{option[vCol]}</label>
              </li>
            )
          }
        </ul>
      </div>
    </div>
  )
}

export default SelectMultiple
*/
/*
<div className='card position-absolute' style={{zIndex: 1000}}>
      <div className='card-header'>
        {selected?.length === options?.length ? 'Todos' : selected?.length } seleccionados
        <div className='float-end'>
          <span className='material-symbols-outlined'>check_circle</span>
          <span className='material-symbols-outlined'>cancel</span>
        </div>
      </div>
      <div className='card-body'>
        <div className='form-check'>
        <div className='form-check'>
          <input className='form-check-input' type='checkbox' value=""  onChange={handleToggleAll} />
          <label className='form-check-label'>*</label>
        </div>
          {
            options?.map((option, i) => 
              <div key={i} className='form-check m-0'>
                <input className='form-check-input' type='checkbox' value={option[kCol]} onChange={handleChange} checked={selected.includes(option[kCol])} />
                <label className='form-check-label'>{option[vCol]}</label>
              </div>
            )
          }
        </div>
      </div>

    </div>
*/