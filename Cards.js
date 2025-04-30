import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import Loading from './Loading';
import Card from './Card';

function Cards({records, defaultModalTitle="Detalle"}) {
  const {table_data_hook, view, numberOfHiddenColumns, extra_columns, wrappers, orderBy, orderDir, setOrderBy, setOrderDir, selectedRows, setSelectedRows, columns_data_hook, records_data_hook} = React.useContext(MetaCrudContext);
  //const records = records_data_hook?.response?.data?.rows;

  return ( records_data_hook?.loading || !records ? <Loading legend='Cargando registros...' /> :
    <div className='d-flex flex-wrap'>
      { records?.map((record,i)=> <Card key={i} record={record} modalTitle={defaultModalTitle} />) }
    </div>
  )
}

export default Cards