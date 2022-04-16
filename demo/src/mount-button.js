import React from 'react'
import Base from './button'

const Button = p => {
  const onClick = () => {
    if (p.onClick) p.onClick()
  }
  return (
    <Base onClick={onClick}>{p.mounted ? 'Unmount' : 'Mount'}</Base>
  )
}

export default Button
