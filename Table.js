import React, { useMemo } from 'react'
import {MetaCrudContext} from './MetaCrud'
import Pagination from './Pagination';
// import FilterIcon from './icons/FilterIcon';
// import ArrowIcon from './icons/ArrowIcon';
// import TableCell from './TableCell';
import TableRowExpansion from './TableRowExpansion';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import Loading from './Loading';
import ColorRefs from './ColorRefs';

export const TableContext = React.createContext();


function Table({className=""}) {
  const {metacrudView, table_data_hook, view, numberOfHiddenColumns, extra_columns, wrappers, orderBy, orderDir, setOrderBy, setOrderDir, selectedRows, setSelectedRows, columns_data_hook, records_data_hook} = React.useContext(MetaCrudContext);


  //console.log(table_data_hook);
  // {"title":"Sugerencias de Asociaciones entre Películas y Shows","views":{"sugerencias":{"regularColumnsOverride":{"updated":{"hidden":true}}, "expressions":[{"statement":"s.ShowId","alias":"ShowId_sugerido","label":"Show Id","isAggregate":false},{"statement":"s.Name","alias":"ShowName_sugerido","label":"Show Name","isAggregate":false},{"statement":"p.id","alias":"pid","label":"Pelicula Id","isAggregate":false},{"statement":"p.titulo_local","alias":"PeliculaTitulo_sugerida","label":"Pelicula Titulo","isAggregate":false}],"joints":["RIGHT JOIN ewave_cca.shows s ON peliculas_shows.ewave_shows_ShowId = s.ShowId","RIGHT JOIN ewave_cca.prefijos_shows ps ON s.Name LIKE CONCAT(ps.prefijo, '%')","RIGHT JOIN muvidb.peliculas p ON s.Name = CONCAT(ps.prefijo, ' ', p.titulo_local)"]}}}
  //const metacrudView = view ? (table_data_hook?.response?.data?.Comment?.metacrud?.views[view]??null) : null;

  const colorRefs = table_data_hook?.response?.data?.Comment?.metacrud?.colorRefs??{};

  const viewOverrides = metacrudView?.regularColumnsOverride??{};

  const viewColumns = metacrudView?.columns??[];

  const totalColumnsQty = 0; //(columns_data_hook?.response?.data?.length??0) + (viewColumns?.length??0);

  //const regularColumns = (columns_data_hook?.response?.data?.map(column => ({...column, Comment: {metacrud: {...(column?.Comment?.metacrud??{}), ...viewOverrides[column?.Field]}}}))??[]);

  const mappedRegularColumns = useMemo(() => (columns_data_hook?.response?.data?.map(column => ({...column, Comment: {metacrud: {order:totalColumnsQty, ...(column?.Comment?.metacrud??{}), ...viewOverrides[column?.Field]}}}))??[]), [columns_data_hook?.response?.data, viewOverrides]);

  const mappedViewColumns = useMemo(() => viewColumns?.map(e=>({Field: e?.a, Comment: {metacrud: {order:totalColumnsQty, ...e}}})), [viewColumns]);

  //const columns = [ ...mappedRegularColumns, ...mappedViewColumns]?.sort((a, b) => b?.Comment?.metacrud?.order??0 - a?.Comment?.metacrud?.order??0);

  const columns = useMemo(() => [ ...mappedRegularColumns, ...mappedViewColumns]?.sort((a, b) => (a?.Comment?.metacrud?.order??0) - (b?.Comment?.metacrud?.order??0)), [mappedRegularColumns, mappedViewColumns]);
  
  console.log("columns", columns);
  // Calculator
  // enableCalc if there is at least one column with numeric type
  const calcEnabled = columns
                      // filter key columns
                      ?.filter(column => !column?.Key)
                      // filter columns with Type tinyint(1)
                      ?.filter(column => column?.Type !== 'tinyint(1)')
                      ?.some(column => column?.Type?.includes('int') || column?.Type?.includes('decimal') || column?.Type?.includes('float') || column?.Type?.includes('double'));
                      
  const [calcTerms, setCalcTerms] = React.useState([0]);
  const calcSum = calcTerms.reduce((acc, term) => {
    if (typeof term === 'number') {
      return acc + term;
    } else {
      return 'NAN';
    }
  });
  const [calcOn, setCalcOn] = React.useState(false);
  const toggleCalcOnOff = () => { setCalcOn(prev=>!prev); };
  const CalculatorAdd = (term) => { setCalcTerms(prev=>[...prev, +term]); };
  const CalculatorSubtract = (term) => { setCalcTerms(prev=>[...prev, -term]); };
  const CalculatorReset = () => { setCalcTerms([0]); };

  //const startCollapsedColumns = columns?.filter(column => column?.Comment?.metacrud?.startCollapsed===true).map(column => column?.Field)??[];

  const startCollapsedColumns = useMemo(() => columns?.filter(column => column?.Comment?.metacrud?.startCollapsed===true).map(column => column?.Field)??[], [columns]);

  const [collapsedColumns, setCollapsedColumns] = React.useState([...startCollapsedColumns]);
  

  const records = records_data_hook?.response?.data?.rows;

  const rowsShowing = records;

  //const primaryKeyName = columns?.find(column => column?.Key === 'PRI')?.Field;

  const primaryKeyName = useMemo(() => columns?.find(column => column?.Key === 'PRI')?.Field, [columns]);


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

  const unhiddenColumns = useMemo(() => columns?.filter(column=>!column?.Comment?.metacrud?.hidden===true), [(columns)]);

  return ( //(columns_data_hook?.loading || records_data_hook?.loading || !records ) ? <div className='spinner-border spinner-border-sm text-primary'></div> : 
    columns_data_hook?.loading ? <Loading legend='Cargando columnas' /> :
    records_data_hook?.loading ? <Loading legend='Cargando registros' /> :
  <TableContext.Provider value={{calcEnabled, calcOn, toggleCalcOnOff, calcTerms, calcSum, CalculatorAdd, CalculatorSubtract, CalculatorReset, unhiddenColumns, colorRefs, collapsedColumns, setCollapsedColumns, expandedRows, setExpandedRows, handleExpandRow}}>
    <div className={'MetaCrudTable '+className}>
      <ColorRefs />
      <div className={'table-responsive w-auto'}>
        <table className='table w-auto table-striped table-hover m-0 border border-tertiary border-1'>
          <thead>
            <tr>
              <th className='px-1 px-2 text-center'><input className='form-check-input' type="checkbox" onChange={handleCheckAll} /></th>
              {
                //columns?.filter(column=>!column?.Comment?.metacrud?.hidden===true)
                unhiddenColumns.map((column, i) => (
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
                  <TableRow key={"TableRow-"+i} handleCheckOne={handleCheckOne} columns={columns} record={record} i={i} tdClassName={tdClassName} handleExpandRow={handleExpandRow} />
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