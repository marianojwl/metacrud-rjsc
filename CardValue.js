import React from 'react'
import {MetaCrudContext} from './MetaCrud'

function Default(props) {
  return (
    <>{props?.record[props?.field]}</>
  )
}

function CardValue({field, record}) {
  const { wrappers } = React.useContext(MetaCrudContext);
  const Wrapper = wrappers?.[field] ?? Default;
  return (
    <Wrapper record={record} field={field} />
  )
}

export default CardValue