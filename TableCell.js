import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import TableCellForm from './TableCellForm';

function TableCell({column, i, j, record, tdClassName, apiCallback}) {
  const [enabled, setEnabled] = React.useState(false);
  const {wrappers} = React.useContext(MetaCrudContext);
  const isForeign = column?.Comment?.metacrud?.foreign_key ? true : false;
  const recordKey = (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field;
  const isWrapped = wrappers[ recordKey ]? true : false;
  const isEditInTableAllowed = column?.Comment?.metacrud?.allowEditInTable?.always || ( column?.Comment?.metacrud?.allowEditInTable?.ifNull && record[ recordKey ] === null );
  const Wrapper = wrappers[ recordKey ];
  return (
    <td key={"TableCell-"+i+"-"+j} className={tdClassName}>
      <div className=''>
        <div className=''>
          {
            enabled ? 
              <TableCellForm column={column} record={record} recordKey={recordKey} apiCallback={apiCallback} enabled={enabled} setEnabled={setEnabled} />
            :
            (
              isWrapped ? 
                <Wrapper key={"wrapper-"+i+"-"+j} inner_key={"wrapper-"+i+"-"+j} field={recordKey} record={record} />  
              : 
                record[ recordKey ] 
            )
          }
          { isEditInTableAllowed && !enabled &&
          <button className='btn btn-sm w-auto'onClick={()=>setEnabled(prev=>!prev)}>
            <span className="material-symbols-outlined">edit</span>
          </button>
          }
        </div>
      </div>
    </td>
)}

export default TableCell