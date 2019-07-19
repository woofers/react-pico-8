
import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'

export default withStyles({
  root: {
    color: grey[100],
    padding: '6px',
    '&$checked': {
      color: grey[50],
    },
  },
  checked: {},
})(p => <Checkbox color="default" {...p} />)
