import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import Cards from './Cards';
import useApi from './useApi';

function DeleteConfirm() {
  const {selectedRows, setSection, records_data_hook, primaryKeyName, api_url, apiCallback, tablename} = React.useContext(MetaCrudContext);

  const delete_hook = useApi(api_url + '/crud/' + tablename, '', false, [], apiCallback);

  const handleEliminar = () => {
    let rta = window.confirm('Esta acción no se puede deshacer. ¿Está seguro que desea continuar?');

    if(!rta) return;

    delete_hook.del(selectedRows?.map(row => ({[primaryKeyName]:row})));

  }

  const recordsToDelete = records_data_hook?.response?.data?.rows.filter(row => selectedRows.includes(row[primaryKeyName]));

  return (
    <div className='MetaCrudDeleteConfirm'>
      <h3>Eliminar {selectedRows.length} registro{selectedRows.length>1?'s':''}</h3>
      <Cards records={recordsToDelete} />
      <p>¿Está seguro que desea eliminar los registros seleccionados?</p>
      <button className='btn btn-danger me-2' onClick={handleEliminar}>Eliminar</button>
      <button className='btn btn-secondary' onClick={()=>setSection('read')}>Cancelar</button>
    </div>
  )
}

export default DeleteConfirm