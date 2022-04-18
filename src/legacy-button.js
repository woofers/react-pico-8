import React from 'react'
import { legacy } from './icons'
import classes from './classnames'
import styles from './legacy-button.module.css'

const cx = classes.bind(styles)

const OldButton = ({
  usePointer,
  onClick: onClickProp,
  button,
  title,
  onTitle,
  on,
  ...p
}) => {
  const isFunction = () => typeof onClickProp === 'function'
  const tag = on ? onTitle : title || button
  const onClick = () => {
    if (!isFunction()) return null
    return onClickProp
  }
  const Button = ({ children }) => {
    if (!isFunction()) return children
    return (
      <button
        className={cx('box', { pointer: usePointer, normal: !usePointer })}
        onClick={onClick()}
        aria-label={tag}
      >
        {children}
      </button>
    )
  }
  const Link = ({ children }) => {
    if (isFunction()) return children
    return (
      <a
        className={cx('box', { pointer: usePointer, normal: !usePointer })}
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        href={onClickProp}
        aria-label={tag}
      >
        {children}
      </a>
    )
  }
  return (
    <Link>
      <Button>
        <img
          width="12px"
          height="12px"
          src={legacy[`${button.toLowerCase()}.png`]}
          alt=""
        />{' '}
        {button}
      </Button>
    </Link>
  )
}

export default OldButton
