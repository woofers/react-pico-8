import React from 'react'
import { icons } from './icons'
import classes from './classnames'
import styles from './button.module.css'

const cx = classes.bind(styles)

const Button = p => {
  let image = p.button.toLowerCase()
  let title = p.title
  if (p.onTitle) {
    image += p.on ? '1' : '0'
  }
  image = icons[`${image}.png`]
  if (p.hidden) return null
  let align = ''
  const Wrapper = p => {
    const isFunction = () => typeof p.onClick === 'function'
    const { disabled, onClick, ...rest } = p
    if (disabled) return <div {...rest}>{p.children}</div>
    return isFunction() ? (
      <div onClick={onClick} {...rest}>
        {p.children}
      </div>
    ) : (
      <a
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        href={onClick}
        {...rest}
      >
        {p.children}
      </a>
    )
  }
  if (p.align === 'left') align = left
  else if (p.align === 'right') align = right
  return (
    <Wrapper
      disabled={p.disabled}
      title={p.on ? p.onTitle : p.title}
      className={
        cx('menu', {
          left: p.align === 'left',
          right: p.align === 'right',
          pointer: p.usePointer,
          normal: !p.usePointer
        }) + ' p8_menu_button'
      }
      onClick={p.onClick}
    >
      <button
        disabled={p.disabled}
        className={cx('mask', {
          'mask-selected': p.selected,
          'button-enabled': !p.disabled
        })}
        style={{ maskImage: `url(${image})` }}
      />
    </Wrapper>
  )
}

export default Button
