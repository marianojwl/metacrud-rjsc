import React from 'react'

function Loading({legend=""}) {
  return (
    <span className='Loading'><span className='spinner-border spinner-border-sm text-primary' role='status'></span> {legend}</span>
  )
}

export default Loading