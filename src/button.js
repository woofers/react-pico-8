import React from 'react'
import classes from './classnames'
import styles from './button.module.css'

const cx = classes.bind(styles)

const Button = p => {
  const title = p.title
  const image = p.button.toLowerCase() + (p.onTitle ? (p.on ? '1' : '0') : '')
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
        className={cx('mask', `icon-${image}`, {
          'mask-selected': p.selected,
          'button-enabled': !p.disabled
        })}
      />
    </Wrapper>
  )
}

export default Button
