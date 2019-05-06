/** @jsx jsx */
import { jsx, css } from '@emotion/core'
const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

const Button = p => {
  let image = p.id
  if (p.id === 'p8b_sound' || p.id === 'p8b_pause') {
    image += p.on ? '1' : '0'
  }
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
    opacity: 0.3;
    padding: 4px;
    display: inline;
    width: 24px;
    height: 24px;
    margin-left: 6px;
    @media only screen and (min-width: 740px) {
      display: table;
    }
    &:hover {
      cursor: pointer;
      opacity: 1;
    }
  `
  let align = ''
  if (p.align === 'left') align = left
  else if (p.align === 'right') align = right
  return (
    <div css={[menu, align]} className="p8_menu_button" id={p.id} onClick={p.onClick}>
      <img src={images[`${image}.png`]} style={{ pointerEvents: 'none' }} />
    </div>
  )
}


export default Button
