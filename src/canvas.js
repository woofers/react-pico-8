/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { blockKeys } from './keys.js'

const Canvas = p => {
  const fullscreen = css`
    width: 100vmin;
    height: 100vmin;
  `
  const normal = css`
    width: 85vmin;
    height: 85vmin;
    max-height: 768px;
    max-width: 768px;
    background-color: #000;
  `
  const canvas = css`
    image-rendering: optimizeSpeed;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: optimize-contrast;
    image-rendering: pixelated;
    -ms-interpolation-mode: nearest-neighbor;
    border: 0px;
    cursor: ${(p.hasStarted && p.hideCursor) ? 'none' : 'auto'};
    outline: none;
  `
  const center = css`
    text-align: center;
  `
  const margin = css`
    @media only screen and (min-width: 768px) {
      margin-left: 45px;
    }
  `
  return (
    <div css={[p.fullscreen || p.center ? center : '', p.center && !p.legacyButtons && !p.isFullscreen ? margin : '' ]}>
      <canvas css={[canvas, p.fullscreen ? fullscreen : normal]}
              className="emscripten"
              id="canvas"
              onContextMenu={(e) => e.preventDefault()}
              onKeyDown={blockKeys}
              tabIndex="-1"
      />
      {p.children}
    </div>
  )
}

export default Canvas
