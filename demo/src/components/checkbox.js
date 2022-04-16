import React from 'react'
import Base from '@mui/material/Checkbox'

const grey100 = '#f5f5f5'

const Checkbox = props => (
  <Base
    {...props}
    color="default"
    sx={{
      padding: '6px',
      color: grey100,
      '&.Mui-disabled': { color: '#3c3a3a !important' }
    }}
  />
)

export default Checkbox
