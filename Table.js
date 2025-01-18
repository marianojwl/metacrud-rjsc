import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import Pagination from './Pagination';

function Table({className=""}) {
  const {orderBy, orderDir, setOrderBy, setOrderDir, selectedRows, setSelectedRows, columns_data_hook, records_data_hook} = React.useContext(MetaCrudContext);
  const columns = columns_data_hook?.response?.data;
  const records = records_data_hook?.response?.data;

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


  return ( (columns_data_hook?.loading || records_data_hook?.loading ) ? <div className='spinner-border spinner-border-sm text-primary'></div> : 
  <div className={'MetaCrudTable '+className}>
    <div className={'table-responsive w-auto'}>
      <table className='table w-auto table-striped table-hover m-0'>
        <thead>
          <tr>
            <th className='px-1 px-2 text-center'><input className='form-check-input' type="checkbox" onChange={handleCheckAll} /></th>
            {
              columns?.map((column, i) => (
                <th key={i}>
                  <div className='d-flex align-items-start'>
                    {column?.Comment?.metacrud?.label??column?.Field}
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
          </tr>
        </thead>
        <tbody>
          {
            records?.map((record, i) => (
              <tr key={i}>
                <td className='p-1 px-2 text-center'><input className='form-check-input' type="checkbox" checked={selectedRows.includes(record[primaryKeyName])} onChange={(e)=>handleCheckOne(e, record[primaryKeyName])} /></td>
                {
                  columns?.map((column, j) => (
                    <td key={j}>{ record[ (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field ] }</td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
    <Pagination className="my-2" />
    </div>
  )
}

export default Table