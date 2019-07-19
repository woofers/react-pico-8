import React from 'react'
import Button from './button'

export default p => {
  const onClick = () => {
    if (p.onClick) p.onClick()
  }
  return (
    <Button onClick={onClick}>{p.mounted ? 'Unmount' : 'Mount'}</Button>
  )
}
