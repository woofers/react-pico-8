import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Base from '@material-ui/core/Button'
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
      backgroundColor: 'rgba(140, 146, 181, 0.08)',
    },
  },
  input: {
    display: 'none',
  },
}))

const Button = p => {
  const classes = useStyles()
  return <Base variant="outlined" color="primary" className={classes.button} onClick={p.onClick}>{p.children}</Base>
}

export default Button
