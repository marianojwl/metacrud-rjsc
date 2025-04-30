import React from 'react'
import ArrowIcon from './icons/ArrowIcon';
import FilterIcon from './icons/FilterIcon';
import {TableContext} from './Table';
import {MetaCrudContext} from './MetaCrud';
import HeaderFilter from './HeaderFilter';


function TableHeader({column, i, setOrderBy, setOrderDir, orderBy, orderDir, showControls=true}) {
  const {collapsedColumns, setCollapsedColumns, colorRefs} = React.useContext(TableContext);
  const {filters} = React.useContext(MetaCrudContext);
  const [filtering, setFiltering] = React.useState(false);
  const recordKey = column?.Field;
  const colorRef = column?.Comment?.metacrud?.colorRef;
  return ( collapsedColumns?.includes(recordKey) ? <th style={{borderBottom: colorRef ? '4px solid '+colorRefs[colorRef]?.c : null}} className='p-0 bg-secondary'><button title="Mostrar" onClick={()=>setCollapsedColumns(collapsedColumns.filter(c=>c!==recordKey))} className='btn btn-sm px-2 py-0 m-0 text-nowrap'  style={{width: '1.5rem'}}
  ><div className='d-flex' style={{transform: 'rotate(270deg) translateX(50%)', whiteSpace: 'nowrap'}}><span className='material-symbols-outlined fs-5 me-1'>visibility</span>{Object.keys(filters).includes(column?.Field)?<span className='material-symbols-outlined fs-5 me-1 text-danger'>filter_list</span>:null} {(column?.Comment?.metacrud?.label??column?.Field)}</div></button></th> :
    <th style={{verticalAlign:'top', borderBottom: colorRef ? '4px solid '+colorRefs[colorRef]?.c : null}} >
      <div className='align-items-start'>
        <div>
          <div style={{whiteSpace:'nowrap'}} className='text-nowrap'>
            <span title={column?.Comment?.metacrud?.description??null}>{column?.Comment?.metacrud?.labelMaterialIcon?<span className='material-symbols-outlined fs-5 me-1' style={{verticalAlign:'text-bottom'}}>{column?.Comment?.metacrud?.labelMaterialIcon}</span>:null}{column?.Comment?.metacrud?.label??column?.Field}</span>
            { showControls &&
              <HeaderFilter disabled={!(column?.Comment?.metacrud?.foreign_key && column?.Comment?.metacrud?.foreign_value )} column={column} />
            }
          </div>
          
        </div>
        <div className='d-flex'>
          {showControls ? <>
            <button 
              title="A-Z"
              disabled={(orderBy === (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_') ?? column.Field)) && orderDir === 'ASC'}
              onClick={()=>{setOrderBy((column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_') ?? column.Field)); setOrderDir('ASC')}} 
              className='btn btn-sm px-0 py-0 ms-0 d-inline text-secondary'><span className='material-symbols-outlined fs-6'>keyboard_arrow_up</span></button>
            <button
              title="Z-A"
              disabled={(orderBy === (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_') ?? column.Field)) && orderDir === 'DESC'}
              onClick={()=>{setOrderBy((column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_') ?? column.Field)); setOrderDir('DESC')}} 
              className='btn btn-sm px-0 py-0 ms-1 d-inline text-secondary'><span className='material-symbols-outlined fs-6'>keyboard_arrow_down</span></button>
            {
              collapsedColumns?.includes(recordKey) ?
              <button 
                title="Mostrar Columna"
                onClick={()=>setCollapsedColumns(collapsedColumns.filter(c=>c!==recordKey))} 
                className='btn btn-sm px-1 py-0 ms-1 d-inline text-secondary'>
                  <span className='material-symbols-outlined fs-6'>visibility</span>
                </button>
              :
              <button 
                title="Ocultar Columna"
                onClick={()=>setCollapsedColumns([...collapsedColumns, recordKey])} 
                className='btn btn-sm px-1 py-0 ms-1 d-inline text-secondary'>
                  <span className='material-symbols-outlined fs-6'>visibility_off</span>
                </button>

            }
          </> : <div>&nbsp;</div>}
        </div>
      </div>
    </th>
  )
}

export default TableHeader