import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import {TableContext} from './Table';
import TableCell from './TableCell'
import useApi from './useApi';
import Loading from './Loading';

function TableRow({columns, i, record, tdClassName, handleCheckOne}) {
  const { extra_columns, api_url, tablename, selectedRows, setSelectedRows, numberOfHiddenColumns, primaryKeyName, query} = React.useContext(MetaCrudContext);
  const {unhiddenColumns, collapsedColumns, setCollapsedColumns, expandedRows, handleExpandRow} = React.useContext(TableContext);
  const [rec, setRec] = React.useState(record);

  const getCallback = React.useCallback((json) => {
    setRec(json?.data?.rows[0]??{});
  }, []);

  const row_hook = useApi(api_url + '/crud/' + tablename + '/' + rec[primaryKeyName], '', false, [], getCallback);

  const apiCallback = React.useCallback((r) => {
    row_hook.get();
  }, []);


  return ( 
    <tr>
      <td className={tdClassName}><input className='form-check-input' type="checkbox" checked={selectedRows.includes(rec[primaryKeyName])} onChange={(e)=>handleCheckOne(e, rec[primaryKeyName])} /></td>
      {
        unhiddenColumns.map((column, j) => ( row_hook?.loading ? <td key={"td-loading-"+i+"-"+j}><Loading /></td> :
          collapsedColumns?.includes(column?.Field) ? <td key={"td-collapsed-"+i+"-"+j} className='bg-secondary'></td> :
          <TableCell key={"TableCell-"+i+"-"+j} i={i} j={j} column={column} record={rec} tdClassName={tdClassName} apiCallback={apiCallback} />
        ))
      }
      
      {
        extra_columns?.map((column, j) => {
          //console.log('extra_columns', column, rec);
          return (<TableCell key={"ec-"+i+"-"+j} i={i} j={j} column={column} record={rec} tdClassName={tdClassName} apiCallback={()=>{}} />)
        })
      }
      {numberOfHiddenColumns ? 
        <td className={tdClassName}>
          <button className='btn btn-sm' onClick={()=>handleExpandRow(record[primaryKeyName])}>
            <span className={'material-symbols-outlined '}>{(expandedRows?.includes(record[primaryKeyName]) ? 'expand_less' : 'expand_more')}</span>
          </button>
        </td> : null
      }
    </tr>
  )
}

export default TableRow