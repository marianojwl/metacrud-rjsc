import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import SearchboxTimeout from '../rjsc-searchbox-timeout/SearchboxTimeout';

const actions = {
  "read": { "label":"Tabla", "buttonClassName":"secondary" },
  "create": { "label":"Nuevo", "buttonClassName":"success" },
  "update": { "label":"Editar", "buttonClassName":"warning" },
  "delete": { "label":"Eliminar", "buttonClassName":"danger" },
};

function ActionBar({className=""}) {
  const {search, setSearch, table_meta, user_roles, selectedRows, section, setSection} = React.useContext(MetaCrudContext);

  const hasPermission = (action) => {
    if(!table_meta?.permissions) return true;
    if(!table_meta?.permissions[action]) return true;
    return user_roles?.some(role => table_meta?.permissions[action]?.includes(role));
  };

  return (
    <div className={'MetaCrudActionBar '+className}>
      {
        Object.keys(actions).map(action => {
          if(!hasPermission(action)) return null;
          const disabled = section===action || (action==='update' && selectedRows?.length!==1) || (action==='delete' && selectedRows?.length===0);
          return (
            <button key={action} disabled={disabled} className={'btn me-2 mb-2 btn-'+(disabled?'outline-':'')+actions[action].buttonClassName} onClick={()=>setSection(action)}>{actions[action].label}</button>
          );
        })
      }
      {section === 'read' && 
      <div className='d-inline-block' style={{width:'150px'}}>
        <SearchboxTimeout autoFocus={false} value={search} setValue={setSearch} placeholder='Buscar...' 
        className="w-100 rounded border border-primary fs-6 py-1 px-2"
        />
      </div>
      }
    </div>
 )
}

export default ActionBar