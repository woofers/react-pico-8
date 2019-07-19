import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { grey } from '@material-ui/core/colors'

const normal = grey[100]

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    width: '145px',
    color: normal,
    borderColor: normal,
    '&:hover': {
      borderColor: grey[200],
    },
  },
  input: {
    display: 'none',
  },
}))

export default p => {
  const classes = useStyles()
  return <Button variant="outlined" color="primary" className={classes.button} onClick={p.onClick}>{p.children}</Button>
}
