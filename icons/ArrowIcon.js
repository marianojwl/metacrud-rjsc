import React from 'react'

function ArrowIcon({dir="left"}) {
  const rotate = (dir === 'rigth' ? 'rotate(180deg)' : (dir === 'up' ? 'rotate(90deg)' : (dir === 'down' ? 'rotate(-90deg)' : '')));
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor" style={{transform: rotate}}>
      <path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z"/>
    </svg>
  )
}

export default ArrowIcon