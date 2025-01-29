import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import Pagination from './Pagination';
import FilterIcon from './icons/FilterIcon';
import ArrowIcon from './icons/ArrowIcon';
import TableCell from './TableCell';
import TableRowExpansion from './TableRowExpansion';
import TableRow from './TableRow';
import TableHeader from './TableHeader';

export const TableContext = React.createContext();

function Table({className=""}) {
  const {numberOfHiddenColumns, extra_columns, wrappers, orderBy, orderDir, setOrderBy, setOrderDir, selectedRows, setSelectedRows, columns_data_hook, records_data_hook} = React.useContext(MetaCrudContext);
  const columns = columns_data_hook?.response?.data?.sort((a, b) => b?.Comment?.metacrud?.order??0 - a?.Comment?.metacrud?.order??0)??[];
  const records = records_data_hook?.response?.data?.rows;

  

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
  <TableContext.Provider value={{expandedRows, setExpandedRows, handleExpandRow}}>
    <div className={'MetaCrudTable '+className}>
      <div className={'table-responsive w-auto'}>
        <table className='table w-auto table-striped table-hover m-0 border border-tertiary border-1'>
          <thead>
            <tr>
              <th className='px-1 px-2 text-center'><input className='form-check-input' type="checkbox" onChange={handleCheckAll} /></th>
              {
                columns?.filter(column=>!column?.Comment?.metacrud?.hidden===true).map((column, i) => (
                  <TableHeader key={"TableHeader-"+i} column={column} i={i} setOrderBy={setOrderBy} setOrderDir={setOrderDir} orderBy={orderBy} orderDir={orderDir} />
                ))
              }

              {
                extra_columns?.map((column, i) => {
                  return <TableHeader showControls={false} key={"ec-"+i} column={column} i={i} setOrderBy={setOrderBy} setOrderDir={setOrderDir} orderBy={orderBy} orderDir={orderDir} />;
                  //return (<th key={"ec-"+i}>{column?.Comment?.metacrud?.label}</th>);
                })
              }
              {
                numberOfHiddenColumns ? 
                <th>
                  <div>
                    <span className='btn material-symbols-outlined'>info</span>
                  </div>
                  <div>&nbsp;</div>
                </th> : null
              }
              
            </tr>
          </thead>
          <tbody>
            {
              records?.map((record, i) => { 
                const tdClassName = (expandedRows?.includes(record[primaryKeyName]) ? 'bg-primary text-light ' : '')+'p-2';
                return (
                <React.Fragment key={"TableRowF-"+i}>
                  <TableRow handleCheckOne={handleCheckOne} columns={columns} key={"TableRow-"+i} record={record} i={i} tdClassName={tdClassName} handleExpandRow={handleExpandRow} />
                {
                  (numberOfHiddenColumns && expandedRows?.includes(record[primaryKeyName])) ? (
                    <TableRowExpansion key={"TableRowExpansion-"+i} record={record} />
                  ) : null
                }
                </React.Fragment>
              );})
            }
          </tbody>
        </table>
      </div>
        <Pagination className="my-3" />
      </div>
    </TableContext.Provider>
  )
}

export default Table