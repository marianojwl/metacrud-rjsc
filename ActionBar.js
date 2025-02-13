import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import SearchboxTimeout from './SearchboxTimeout';


function ActionBar({className=""}) {
  const {reloadRecords, sections, search, setSearch, table_meta, user_roles, selectedRows, section, setSection} = React.useContext(MetaCrudContext);

  const hasPermission = (action) => {
    if(!table_meta?.permissions) return true;
    if(!table_meta?.permissions[action]) return true;
    return user_roles?.some(role => table_meta?.permissions[action]?.includes(role));
  };

  return (
    <div className={'MetaCrudActionBar '+className}>
      <button onClick={reloadRecords} className='btn btn-outline-secondary me-2 mb-2'><span className="material-symbols-outlined" style={{verticalAlign:"text-bottom"}}>refresh</span></button>
      {
        //Object.keys(actions).map(action => {
        Object.keys(sections).map(sec => {
          const action = sections[sec]?.action;
          //if(!hasPermission(action)) return null;
          if(!hasPermission(action)) return null;
          //const disabled = section===action || (action==='update' && selectedRows?.length!==1) || (action==='delete' && selectedRows?.length===0);
          const disabled = section===sec || ((sec==='update' || sec==='duplicate') && selectedRows?.length!==1) || (sec==='delete' && selectedRows?.length===0);
          return (
            <button key={sec} disabled={disabled} className={'btn d-inline-flex me-2 mb-2 btn-'+(disabled?'outline-':'')+sections[sec].buttonClassName} onClick={()=>setSection(sec)}><span className="material-symbols-outlined" style={{verticalAlign:"text-bottom"}}>{sections[sec]?.icon}</span><span className='ms-1 d-none d-md-inline-block'>{sections[sec].label}</span></button>
          );
        })
      }
      {section === 'read' && 
        <SearchboxTimeout 
          autoFocus={false} 
          value={search} 
          setValue={setSearch} 
          placeholder='Buscar...' 
          className="w-100 rounded border border-primary fs-6 py-1 px-2"
        />
      }
      
    </div>
 )
}
/*
        
        */
export default ActionBar