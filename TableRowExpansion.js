import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import TableCell from './TableCell';

function TableRowExpansion({i, record}) {
  const {wrappers, extra_columns, columns, numberOfHiddenColumns} = React.useContext(MetaCrudContext);
  return (
    <tr key={i+'-data'} className=''>
      <td colSpan={columns?.length+extra_columns?.length-numberOfHiddenColumns+2} className='border border-primary border-2'>
        {
          columns?.filter(column=>column?.Comment?.metacrud?.hidden===true || column?.Comment?.metacrud?.foreign_key).map((column, j) => {
            
            const recordKey = (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field;
            return (
            <div key={j} className='d-flex align-items-start'>
              <span className='fw-bold'>{column?.Comment?.metacrud?.label??column?.Field}:&nbsp;</span>
              {
                column?.Comment?.metacrud?.foreign_key ? 
                <span>{record[recordKey]} [{column?.Field}: {record[ column?.Field ]}] </span> :
                <TableCell key={"TableCell-"+i+"-"+j} i={i} j={j} column={column} record={record} tdClassName='' apiCallback={()=>{}} />
              }
              { /* <span className='ms-1'>{ wrappers[ recordKey ]? wrappers[ recordKey ]("wrapper-"+i+"-"+j, recordKey ,record) : record[ recordKey ] } { (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ? ("[" + column?.Field +":" + record[ column?.Field ] + "]") : ''}</span> */   }
              <span>{}</span>
            </div>
          )})
        }
      </td>
    </tr>
  )
}

export default TableRowExpansion