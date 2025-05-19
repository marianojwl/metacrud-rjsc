import React from 'react'
import {TableContext} from './Table'
import { MetaCrudContext } from './MetaCrud';


function Calculator(){
  const { CalculatorReset, calcTerms, calcSum, toggleCalcOnOff, calcOn } = React.useContext(TableContext);
  const totalSum = calcSum;
  // const totalSum = calcTerms.reduce((acc, term) => {
  //   if (typeof term === 'number') {
  //     return acc + term;
  //   } else {
  //     return 'NAN';
  //   }
  // });

  const formattedSum = totalSum.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (<div className='Calculator bg-secondary rounded p-1 d-inline-flex' title={calcTerms?.map(term => term?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))?.join('\n')}>
    <span className='material-symbols-outlined fs-5 d-inline-flex me-1 text-light'>calculate</span>
    <div className="form-check form-switch d-inline-flex">
      <input className="form-check-input" type="checkbox" role="switch" checked={calcOn} onChange={toggleCalcOnOff} />
    </div>
    { calcOn && <>
    <span className='mx-2 d-inline-flex font-monospace fw-bold text-light' style={{verticalAlign:'text-bottom'}}>{formattedSum}</span>
    <button className='btn btn-sm bg-secondary p-0 d-inline-flex' onClick={CalculatorReset} style={{verticalAlign:'baseline'}}>
      <span className='material-symbols-outlined fs-6 d-flex text-light'>clear</span>
    </button>
    </>}
  </div>);
}

function CollapseColorGroupToggle({colorRefKey, label}) {
  const {colorRefs, setCollapsedColumns, collapsedColumns, unhiddenColumns} = React.useContext(TableContext);
  const fieldnames = unhiddenColumns?.filter(column => column?.Comment?.metacrud?.colorRef === colorRefKey)?.map(column => column?.Field);
  const isGroupCollapsed = fieldnames?.some(fieldname => collapsedColumns?.includes(fieldname));
  const toggleCollapse = () => {
    setCollapsedColumns(prevState => {
      // if prevState array contains any of the fieldnames, return the array without them
      if (prevState.some(item => fieldnames?.includes(item))) {
        return prevState.filter(item => !fieldnames?.includes(item));
      } else {
        // if prevState array does not contain any of the fieldnames, return the array with them
        return [...prevState, ...fieldnames];
      }
    });
  };
  return (
    <button className='btn btn-sm py-0 px-1' onClick={toggleCollapse}>
      <span className="material-symbols-outlined fs-6 p-1 rounded" style={{verticalAlign:"text-bottom",backgroundColor: colorRefs[colorRefKey]?.c}}>{!isGroupCollapsed?'visibility':'visibility_off'}</span> {label}
    </button>
  );
}

function ColorRefs() {
  const {calcEnabled, colorRefs, setCollapsedColumns} = React.useContext(TableContext);
  const {records_data_hook} = React.useContext(MetaCrudContext);
  return (
    <div className='colorRefs mb-2 d-flex flex-wrap position-relative'>
      <div className='position-sticky top-0 start-0'>
        <div className='me-2 d-inline-flex'>
          <span className='material-symbols-outlined fs-5 d-inline-flex me-1 text-muted'>hourglass_bottom</span>
          <span className='text-muted' title='Tiempo de Ejecución'>{records_data_hook?.response?.data?.executionTime?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} s</span>
        </div>
        {
          Object.keys(colorRefs).map((key, i) => (
            <div key={"colorRef-"+i} className='me-2 d-inline-flex'>
              <CollapseColorGroupToggle label={colorRefs[key]?.l} colorRefKey={key} />
            </div>
          ))
        }
        { calcEnabled && <Calculator /> }
    </div>
    </div>
  )
}

export default ColorRefs