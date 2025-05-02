import React, { useMemo } from 'react'
import {MetaCrudContext} from './MetaCrud'
import TableCellForm from './TableCellForm';
import {TableContext} from './Table';

function CalculatorAddButton({term}) {
  const { CalculatorAdd } = React.useContext(TableContext);
  return (<button className='btn btn-sm w-auto d-inline-flex p-0 m-0' onClick={()=>CalculatorAdd(term)}>
    <span className="material-symbols-outlined">add</span>
  </button>)
};

function CalculatorSubtractButton({term}) {
  const { CalculatorSubtract } = React.useContext(TableContext);
  return (<button className='btn btn-sm w-auto d-inline-flex p-0 m-0' onClick={()=>CalculatorSubtract(term)}>
    <span className="material-symbols-outlined">remove</span>
  </button>)
};

function ClickToFilterWrapper(props) {

  const { setFilters, filters, ctrlKey } = React.useContext(MetaCrudContext);


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
    {record[foreign_value??field]}
  </a>
)
}

function HTMLWrapper(props) {
  const value = props?.record[props?.field];
  if(!value) return null;
  return (<div dangerouslySetInnerHTML={{__html: value}} />);
}

function HTMLModalPreviewWrapper(props) {
  const value = props?.record[props?.field];
  if(!value) return null;
  return(<div className='HTMLModalPreviewWrapper' key={'HTMLModalPreviewWrapper-'+props?.inner_key}>
    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={'#HTMLModalPreviewWrapper-'+props?.inner_key}>
      Vista Previa
    </button>

    <div className="modal fade" id={'HTMLModalPreviewWrapper-'+props?.inner_key} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Vista Previa</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div dangerouslySetInnerHTML={{__html: value}} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

function TableCell({column, i, j, record, tdClassName, apiCallback}) {
  const {calcOn, calcSum} = React.useContext(TableContext);
  const [enabled, setEnabled] = React.useState(false);
  const {wrappers} = React.useContext(MetaCrudContext);
  const isForeign = column?.Comment?.metacrud?.foreign_key ? true : false;
  //const recordKey = (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field;
  const recordKey = useMemo(() => (column?.Comment?.metacrud?.foreign_value?.replaceAll('.','_')) ?? column.Field, [column]);
  const isWrapped = wrappers[ recordKey ]? true : (column?.Field?.endsWith('_HTML') || column?.Field?.endsWith('_html_body'));
  const isEditInTableAllowed = column?.Comment?.metacrud?.allowEditInTable?.always || ( column?.Comment?.metacrud?.allowEditInTable?.ifNull && record[ recordKey ] === null );
  const Wrapper = (column?.Field?.endsWith('_HTML') || column?.Field?.endsWith('_html_body')) ? HTMLModalPreviewWrapper : wrappers[ recordKey ];
  const preformattedTypes = ['text','tinytext'];
  return (
    <td key={"TableCell-"+i+"-"+j} className={tdClassName}>
      <div className=''>
        <div className={(calcOn && calcSum && calcSum==record[recordKey])?'bg-primary text-light':''}>
          {
            enabled ? 
              <TableCellForm column={column} record={record} recordKey={recordKey} apiCallback={apiCallback} enabled={enabled} setEnabled={setEnabled} />
            :
            (
              isWrapped ? 
                <Wrapper key={"wrapper-"+i+"-"+j} inner_key={"wrapper-"+i+"-"+j} field={recordKey} record={record} apiCallback={apiCallback} />  
              : 
              isForeign ? 
                <ClickToFilterWrapper key={"ClickToFilter-"+i+"-"+j} record={record} column={column} />
              :
              preformattedTypes?.includes(column?.Type) ? 
                <pre style={{maxHeight:'2.5rem', overflowY: 'hidden' }} title={record[recordKey]}>{record[recordKey]}</pre> : 
                (column?.Type ===  'boolean' || column?.Type ===  'tinyint(1)') ?
                  <div className='form-check form-switch'>
                    <input className='form-check-input' type="checkbox" checked={record[recordKey]==1} disabled={true}  />
                  </div>
                :
                <ClickToFilterWrapper key={"ClickToFilter-"+i+"-"+j} record={record} column={column} />
            )
          }
          { // if numeric or string containing numbers, show calculator buttons
          (calcOn && ( typeof record?.[recordKey] === 'numeric' ||typeof record?.[recordKey] === 'string' ) &&  (record?.[recordKey])?.match(/^(\-)?[0-9]+(\.[0-9]+)?$/)) && 
          <div className='d-flex'>
            <CalculatorAddButton term={record[recordKey]} />
            <CalculatorSubtractButton term={record[recordKey]} />
          </div>
          }
          { (isEditInTableAllowed || (column?.Type ===  'boolean' || column?.Type ===  'tinyint(1)') ) && !enabled &&
          <button className='btn btn-sm w-auto'onClick={()=>setEnabled(prev=>!prev)}>
            <span className="material-symbols-outlined">edit</span>
          </button>
          }
        </div>
      </div>
    </td>
)}

export default TableCell