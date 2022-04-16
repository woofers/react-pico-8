import React from 'react'
import Base from '@mui/material/Button'

const grey100 = '#f5f5f5'
const grey200 = '#eeeeee'
const normal = grey100

const Button = p => {
  return (
    <Base
      sx={{
        margin: '8px',
        width: '145px',
        color: normal,
        borderColor: normal,
        fontFamily: "'Lato', sans-serif",
        '&:hover': {
          borderColor: grey200,
          backgroundColor: 'rgba(140, 146, 181, 0.08)',
        }
      }}
      variant="outlined"
      color="primary"
      onClick={p.onClick}
    >
        {p.children}
    </Base>
  )
}

export default Button
