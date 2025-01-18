import React from 'react'
import {MetaCrudContext} from './MetaCrud'

function Pagination({className}) {
  const {table_status, records_data_hook, page, setPage, pageLimit, setPageLimit} = React.useContext(MetaCrudContext);

  const aproxRowCount = table_status?.Rows;

  // array with page numbers 1 to aproxRowCount/pageLimit
  const pages = Array.from({length: 1+Math.ceil(aproxRowCount/pageLimit)}, (_, i) => i+1);

  return (
    <div className={'MetaCrudPagination justify-content-center '+className}>
      <button className='btn btn-secondary me-2' onClick={()=>setPage(page-1)} disabled={page===1}>&lt;</button>
      <select className='form-select me-2 w-auto d-inline' value={page} onChange={e=>setPage(Number(e.target.value))}>
        {
          pages.map((p, i) => (
            <option key={i} value={p}>Página {p}</option>
          ))
        }
      </select>
      <button className='btn btn-secondary' onClick={()=>setPage(page+1)} disabled={records_data_hook?.response?.data?.length<pageLimit}>&gt;</button>
      <select className='form-select ms-2 w-auto d-inline' value={pageLimit} onChange={e=>{setPageLimit(Number(e.target.value)); setPage(1)}}>
        {
          [10, 20, 50, 100].map((limit, i) => (
            <option key={i} value={limit}>Mostrar de a {limit}</option>
          ))
        }
      </select>
    </div>
  )
}

export default Pagination