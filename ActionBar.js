import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import SearchboxTimeout from './SearchboxTimeout';


function ActionBar({className=""}) {
  const {searchDisabled, hiddenForcedSections, allowRelate, batchCreateColumns, reloadRecords, sections, search, setSearch, table_meta, user_roles, selectedRows, section, setSection} = React.useContext(MetaCrudContext);

  const hasPermission = (action) => {
    if(action==='config') {
      if(user_roles?.includes(1)) return true;
      else return false;
    }
    if(!table_meta?.permissions) return true;
    if(!table_meta?.permissions[action]) return true;
    
    return user_roles?.some(role => table_meta?.permissions[action]?.includes(role));
  };

  const hiddenSections = hiddenForcedSections.concat(allowRelate?[]:['relate']);

  return (
    <div className={'MetaCrudActionBar d-flex flex-wrap '+className}>
      <div className='position-relative'>
      <div className='position-sticky top-0 start-0'>
      <button onClick={reloadRecords} className='btn btn-outline-secondary me-2 mb-2'><span className="material-symbols-outlined" style={{verticalAlign:"text-bottom"}}>refresh</span></button>
      {
        Object.keys(sections)?.map((sec,index)=>{
          const disabled = section===sec || ((sec==='update' || sec==='duplicate') && selectedRows?.length!==1) || (sec==='delete' && selectedRows?.length===0);
          return (
              hiddenSections?.includes(sec) || 
              !hasPermission(sections[sec]?.action) || 
              (sec==='batchCreate' && !batchCreateColumns?.length) ||
              (sec==='chart' && !table_meta?.charts?.length) ||
              (sec==='import' && !table_meta?.import)
            ) ? null : 
            <button 
              key={'section_button_'+index} 
              disabled={disabled} 
              className={'btn d-inline-flex me-2 mb-2 btn-'+(disabled?'outline-':'')+sections[sec].buttonClassName} 
              onClick={()=>setSection(sec)}>
                <span className="material-symbols-outlined" style={{verticalAlign:"text-bottom"}}>{sections[sec]?.icon}</span>
                <span className='ms-1 d-none d-md-inline-block'>{sections[sec].label}</span>
            </button>
        })
        /*
        //Object.keys(actions).map(action => {
        Object.keys(sections)
        .filter(sec => !hiddenSections.includes(sec))
        .map(sec => {
          const action = sections[sec]?.action;
          
          if(!hasPermission(action)) return null;
          
          if(sec==='batchCreate' && !batchCreateColumns?.length) return null;

          const disabled = section===sec || ((sec==='update' || sec==='duplicate') && selectedRows?.length!==1) || (sec==='delete' && selectedRows?.length===0);
          return (
            <button key={sec} disabled={disabled} className={'btn d-inline-flex me-2 mb-2 btn-'+(disabled?'outline-':'')+sections[sec].buttonClassName} onClick={()=>setSection(sec)}><span className="material-symbols-outlined" style={{verticalAlign:"text-bottom"}}>{sections[sec]?.icon}</span><span className='ms-1 d-none d-md-inline-block'>{sections[sec].label}</span></button>
          );
        })
        */
      }
      { (section === 'read' && !searchDisabled) &&
        <SearchboxTimeout 
          autoFocus={false} 
          value={search} 
          setValue={setSearch} 
          placeholder='Buscar...' 
          className="w-100 rounded border border-primary fs-6 py-1 px-2"
        />
      }
      
    </div>
    </div>
    </div>
 )
}
/*
        
        */
export default ActionBar