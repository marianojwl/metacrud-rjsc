import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import Pagination from './Pagination';

function Table({className=""}) {
  const {extra_columns, wrappers, orderBy, orderDir, setOrderBy, setOrderDir, selectedRows, setSelectedRows, columns_data_hook, records_data_hook} = React.useContext(MetaCrudContext);
  const columns = columns_data_hook?.response?.data;
  const records = records_data_hook?.response?.data;

  const numberOfHiddenColumns = columns?.filter(column=>column?.Comment?.metacrud?.hidden===true)?.length || 0;

  const rowsShowing = records;

  const primaryKeyName = columns?.find(column => column?.Key === 'PRI')?.Field;


  const handleCheckAll = (e) => {
    if(e.target.checked) {
      setSelectedRows(rowsShowing.map(r => r[primaryKeyName]));
    } else {
      setSelectedRows([]);
    }
  };

  const handleCheckOne = (e, id) => {
    if(e.target.checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(r => r !== id));
    }
  };

  const [expandedRows, setExpandedRows] = React.useState([]);

  const handleExpandRow = (id) => {
    if(expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter(r => r !== id));
    }
    else {
      setExpandedRows([...expandedRows, id]);
    }
  };


  return ( (columns_data_hook?.loading || records_data_hook?.loading ) ? <div className='spinner-border spinner-border-sm text-primary'></div> : 
  <div className={'MetaCrudTable '+className}>
    <div className={'table-responsive w-auto'}>
      <table className='table w-auto table-striped table-hover m-0 border border-tertiary border-1'>
        <thead>
          <tr>
            <th className='px-1 px-2 text-center'><input className='form-check-input' type="checkbox" onChange={handleCheckAll} /></th>
            {
              columns?.filter(column=>!column?.Comment?.metacrud?.hidden===true).map((column, i) => (
                <th key={i}>
                  <div className='d-flex align-items-start'>
                    <small>{column?.Comment?.metacrud?.label??column?.Field}</small>
                    <button 
                      disabled={(orderBy === (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field) && orderDir === 'ASC'}
                      onClick={()=>{setOrderBy((column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field); setOrderDir('ASC')}} 
                      className='btn btn-sm px-1 py-0 ms-1 d-inline'>&uArr;</button>
                    <button
                      disabled={(orderBy === (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field) && orderDir === 'DESC'}
                      onClick={()=>{setOrderBy((column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field); setOrderDir('DESC')}} 
                      className='btn btn-sm px-1 py-0 ms-1 d-inline'>&dArr;</button>
                  </div>
                </th>
              ))
            }
            {
              /*
              extra_columns?.map((column, i) => (
                <th key={"ec"+i}>{column?.Comment?.metacrud?.label??column?.Field}</th>
              ))
              */
            }
          </tr>
        </thead>
        <tbody>
          {
            records?.map((record, i) => { 
              const tdClassName = (expandedRows.includes(i) ? 'bg-primary text-light ' : '')+'p-2';
              return (
              <>
              <tr key={i} onDoubleClick={numberOfHiddenColumns?()=>handleExpandRow(i):null} title={numberOfHiddenColumns ? 'Doble click para expandir' : null}>
                <td className={tdClassName}><input className='form-check-input' type="checkbox" checked={selectedRows.includes(record[primaryKeyName])} onChange={(e)=>handleCheckOne(e, record[primaryKeyName])} /></td>
                {
                  columns?.filter(column=>!column?.Comment?.metacrud?.hidden===true).map((column, j) => (
                    <td key={j} className={tdClassName}>{ wrappers[ (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column?.Field ]? wrappers[ (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column?.Field ]("wrapper-"+i+"-"+j, (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column?.Field ,record) : record[ (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column?.Field ] }</td>
                  ))
                }
                {/*
                  extra_columns?.map((column, j) => (
                    <td key={"ecc-"+j} className={tdClassName}>{ wrappers[ (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field ]? wrappers[ (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field ]("wrapper-"+i+"-"+j, (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field ,record) : record[ (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field ] }</td>
                  ))
                */}
              </tr>
              {
                (numberOfHiddenColumns && expandedRows.includes(i)) ? (
                  <tr key={i+'-data'} className=''>
                    <td colSpan={columns.length-numberOfHiddenColumns+1} className='border border-primary border-2'>
                      {
                        columns?.filter(column=>column?.Comment?.metacrud?.hidden===true).map((column, j) => (
                          <div key={j} className='d-flex align-items-start'>
                            <span className='fw-bold'>{column?.Comment?.metacrud?.label??column?.Field}: </span>
                            <span className='ms-1'>{ wrappers[ (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field ]? wrappers[ (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field ]("wrapper-"+i+"-"+j, (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field ,record) : record[ (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field ] }</span>
                          </div>
                        ))
                      }
                    </td>
                  </tr>
                ) : null
              }
              </>
            );})
          }
        </tbody>
      </table>
    </div>
    <Pagination className="my-2" />
    </div>
  )
}

export default Table