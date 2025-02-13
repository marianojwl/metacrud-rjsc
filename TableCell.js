import React, { useMemo } from 'react'
import {MetaCrudContext} from './MetaCrud'
import TableCellForm from './TableCellForm';
import { AppContext } from '../../App';

function ClickToFilterWrapper(props) {
  const { setFilters, filters } = React.useContext(MetaCrudContext);

  const {ctrlKey} = React.useContext(AppContext);

  const [mouseOver, setMouseOver] = React.useState(false);


  const field = props?.column?.Field;
  const foreign_key = props?.column?.Comment?.metacrud?.foreign_key?.replaceAll('.','_');
  const foreign_value = props?.column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_');
  const record = props?.record;


  return (
  <a 
    onMouseOver={()=>setMouseOver(true)}
    onMouseOut={()=>setMouseOver(false)}
    href={mouseOver && ctrlKey ? '#' : null}
    style={{cursor: (mouseOver && ctrlKey) ? ( filters[field]?.includes(record[field]) ? 'zoom-out' : 'zoom-in' ) : 'text'}}
    role="button"
    title={mouseOver && ctrlKey ? null: 'Ctrl+Click para filtrar' }
    onClick={!(mouseOver && ctrlKey)?null:(e)=>{ 
    e.preventDefault();
    setFilters(prev=>{
      if(prev[field]?.includes(record[field])) {
        return ({...prev, [field]: prev[field].filter(v=>v!==record[field])})
      } else {
        return ({...prev, [field]: [...(prev[field]??[]), record[field]]})
      }
    });
  }}>
    {record[foreign_value]}
  </a>
)
}

function TableCell({column, i, j, record, tdClassName, apiCallback}) {
  const [enabled, setEnabled] = React.useState(false);
  const {wrappers} = React.useContext(MetaCrudContext);
  const isForeign = column?.Comment?.metacrud?.foreign_key ? true : false;
  //const recordKey = (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field;
  const recordKey = useMemo(() => (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field, [column]);
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
              isForeign ? 
                <ClickToFilterWrapper key={"ClickToFilter-"+i+"-"+j} record={record} column={column} />
              :
              record[recordKey]
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