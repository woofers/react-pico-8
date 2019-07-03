/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { start } from './icons'

const Start = p => {
  const bg = p.placeholder ? `url(${p.placeholder})` : '#000'
  const style = css`
    max-width: 768px;
    max-height: 768px;
    display: flex;
    img {
      margin: auto;
    }
    cursor: ${p.usePointer ? 'pointer' : 'auto'};
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
    border: 0;
  `
  const center = css`
    margin-left: auto;
    margin-right: auto;
  `
  return (
    <button title="Start Game" css={[style, p.center ? center : '']} onClick={p.onClick}>
      <img alt="" src={start}/>
    </button>
  )
}

export default Start
