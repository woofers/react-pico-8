/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { icons } from './icons'

const Button = p => {
  let image = p.id
  let title = p.title
  if (p.id === 'p8b_sound' || p.id === 'p8b_pause') {
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
        background: #fff;
      }
    }
  `
  const mask = css`
    width: 24px;
    height: 24px;
    background: #64605d;
    -webkit-mask-image: url(${image});
    mask-image: url(${image});
    pointer-events: none;
    display: inline-block;
    border: 0;
  `
  let align = ''
  if (p.align === 'left') align = left
  else if (p.align === 'right') align = right
  return (
    <div title={p.on ? p.onTitle : p.title} css={[menu, align]}
         className="p8_menu_button" id={p.id} onClick={p.onClick}>
      <button css={mask} />
    </div>
  )
}


export default Button
