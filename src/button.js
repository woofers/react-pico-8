/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { icons } from './icons'

const Button = p => {
  let image = p.button.toLowerCase()
  let title = p.title
  if (p.onTitle) {
    image += p.on ? '1' : '0'
  }
  image = icons[`${image}.png`]
  if (p.hidden) return null
  const left = css`
    float: left !important;
    margin: 0 0 0 10px;
  `
  const right = css`
    float: right !important;
    margin: 0 10px 0 0;
  `
  const menu = css`
    padding: 4px;
    display: inline;
    margin-left: 6px;
    @media only screen and (min-width: 768px) {
      display: table;
    }
    &:hover {
      cursor: ${p.usePointer ? 'pointer' : 'auto'};
      button {
        ${p.disabled ? '' : 'background: #fff'};
      }
    }
  `
  const mask = css`
    width: 24px;
    height: 24px;
    background: ${p.selected ? '#b9b2ad' : '#64605d'};
    -webkit-mask-image: url(${image});
    mask-image: url(${image});
    pointer-events: none;
    display: inline-block;
    border: 0;
  `
  let align = ''
  const Wrapper = p => {
    const isFunction = () => typeof p.onClick === 'function'
    const { disabled, onClick, ...rest } = p
    if (disabled) return <div {...rest}>{p.children}</div>
    return (isFunction()
      ? <div onClick={onClick} {...rest}>{p.children}</div>
      : <a role="button" target="_new" href={onClick} {...rest}>{p.children}</a>
    )
  }
  if (p.align === 'left') align = left
  else if (p.align === 'right') align = right
  return (
    <Wrapper disabled={p.disabled} title={p.on ? p.onTitle : p.title} css={[menu, align]}
         className="p8_menu_button" onClick={p.onClick}>
      <button disabled={p.disabled} css={mask} />
    </Wrapper>
  )
}

export default Button
