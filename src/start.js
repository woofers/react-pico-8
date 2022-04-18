import React from 'react'
import { start } from './icons'
import classes from './classnames'
import styles from './start.module.css'

const cx = classes.bind(styles)

const Start = ({ onClick, placeholder, usePointer, center, ...rest }) => {
  const background = placeholder
    ? `rgba(0, 0, 0, 0) url(${placeholder}) no-repeat scroll 0% 0% / cover`
    : '#000'
  return (
    <button
      className={cx('box', {
        center,
        pointer: usePointer,
        normal: !usePointer
      })}
      title="Start Game"
      style={{ background }}
      onClick={onClick}
      type="button"
    >
      <img alt="" src={start} className={styles.img} />
    </button>
  )
}

export default Start
