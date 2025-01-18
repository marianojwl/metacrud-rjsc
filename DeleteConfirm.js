import React from 'react'
import {MetaCrudContext} from './MetaCrud'

function DeleteConfirm() {
  const {selectedRows, setSection} = React.useContext(MetaCrudContext);

  const handleEliminar = () => {
    let rta = window.confirm('Esta acción no se puede deshacer. ¿Está seguro que desea continuar?');

    console.log(rta);

  }
  return (
    <div className='MetaCrudDeleteConfirm'>
      <h3>Eliminar {selectedRows.length} registro{selectedRows.length>1?'s':''}</h3>
      <ul>
        { selectedRows.map((id, i) => (
          <li key={i}>{id}</li>
        )) }
      </ul>
      <p>¿Está seguro que desea eliminar los registros seleccionados?</p>
      <button className='btn btn-danger me-2' onClick={handleEliminar}>Eliminar</button>
      <button className='btn btn-secondary' onClick={()=>setSection('read')}>Cancelar</button>
    </div>
  )
}

export default DeleteConfirm