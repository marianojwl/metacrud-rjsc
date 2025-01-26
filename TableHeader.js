import React from 'react'
import ArrowIcon from './icons/ArrowIcon';
import FilterIcon from './icons/FilterIcon';
import SelectMultiple from './SelectMultiple';


function TableHeader({column, i, setOrderBy, setOrderDir, orderBy, orderDir, showControls=true}) {
  const [filtering, setFiltering] = React.useState(false)
  return (
    <th>
      <div className='align-items-start'>
        <div>
          <div style={{whiteSpace:'nowrap'}} className='text-nowrap'>
            {column?.Comment?.metacrud?.label??column?.Field}
            { showControls &&
              <SelectMultiple disabled={!(column?.Comment?.metacrud?.foreign_key && column?.Comment?.metacrud?.foreign_value )} column={column} />
            }
          </div>
          
        </div>
        <div className=''>
          {showControls ? <>
            <button 
              title="A-Z"
              disabled={(orderBy === (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_') ?? column.Field)) && orderDir === 'ASC'}
              onClick={()=>{setOrderBy((column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_') ?? column.Field)); setOrderDir('ASC')}} 
              className='btn btn-sm px-1 py-0 ms-1 d-inline text-secondary'><ArrowIcon dir='up' /></button>
            <button
              title="Z-A"
              disabled={(orderBy === (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_') ?? column.Field)) && orderDir === 'DESC'}
              onClick={()=>{setOrderBy((column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_') ?? column.Field)); setOrderDir('DESC')}} 
              className='btn btn-sm px-1 py-0 ms-1 d-inline text-secondary'><ArrowIcon dir='down' /></button>
          </> : <div>&nbsp;</div>}
        </div>
      </div>
    </th>
  )
}

export default TableHeader