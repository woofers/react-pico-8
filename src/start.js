/** @jsx jsx */
import { jsx, css } from '@emotion/core'
const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

const Start = p => {
  const bg = p.placeholder ? `url(${p.placeholder})` : '#000'
  const style = css`
    max-width: 768px;
    max-height: 768px;
    display: flex;
    img {
      margin: auto;
    }
    cursor: pointer;
    background: ${bg};
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    position: relative;
    left: 0px;
    top: 0px;
    width: 85vmin;
    height: 85vmin;
  `
  const center = css`
    margin-left: auto;
    margin-right: auto;
  `
  return (
    <div css={[style, p.center ? center : '']} onClick={p.onClick} id="p8_start_button">
      <img alt="Play Game" src={images['start.png']}/>
    </div>
  )
}

export default Start
