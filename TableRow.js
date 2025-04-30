import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import {TableContext} from './Table';
import TableCell from './TableCell'
import useApi from './useApi';
import Loading from './Loading';

export const TableRowContext = React.createContext({});

function TableRow({columns, i, record, tdClassName, handleCheckOne}) {
  const { view, extra_columns, api_url, tablename, selectedRows, setSelectedRows, numberOfHiddenColumns, primaryKeyName, query} = React.useContext(MetaCrudContext);
  const {unhiddenColumns, collapsedColumns, setCollapsedColumns, expandedRows, handleExpandRow} = React.useContext(TableContext);
  const [rec, setRec] = React.useState(record);

  const getCallback = React.useCallback((json) => {
    setRec(json?.data?.rows[0]??{});
  }, []);

  const row_hook = useApi(api_url + '/crud/' + tablename + '/' + rec[primaryKeyName], '', false, [], getCallback);

  const apiCallback = React.useCallback((r) => {
    const ep = view ? '/?metacrudView='+view : '';
    row_hook.get(ep);
  }, []);


  return ( !rec ? null : <TableRowContext.Provider value={{apiCallback}}>
    <tr>
      <td className={tdClassName}><input className='form-check-input' type="checkbox" checked={selectedRows.includes(rec[primaryKeyName])} onChange={(e)=>handleCheckOne(e, rec[primaryKeyName])} /></td>
      {
        unhiddenColumns.map((column, j) => ( row_hook?.loading ? <td key={"td-loading-"+i+"-"+j}><Loading /></td> :
          collapsedColumns?.includes(column?.Field) ? <td key={"td-collapsed-"+i+"-"+j} className='bg-secondary'>{rec[column?.Field]?<button onClick={()=>setCollapsedColumns(prev=>prev?.filter(item=>item!==column?.Field))} className='btn p-0 m-0' title={rec[column?.Field]?.toString()}>{rec[column?.Field]?.toString()?.substring(0, 1)}{rec[column?.Field]?.toString()?.length>2?'...':''}</button>:''}</td> :
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
  </TableRowContext.Provider>)
}

export default TableRow