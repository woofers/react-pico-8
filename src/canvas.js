import React from 'react'
import { blockKeys } from './keys'
import classes from './classnames'
import styles from './canvas.module.css'

const cx = classes.bind(styles)

const Canvas = p => {
  return (
    <div
      className={cx({
        center: p.fullscreen || p.center,
        margin: p.center && !p.legacyButtons && !p.isFullscreen
      })}
    >
      <canvas
        className={
          cx('canvas', {
            fullscreen: p.fullscreen,
            normal: !p.fullscreen,
            none: p.hasStarted && p.hideCursor
          }) + ' emscripten'
        }
        id="canvas"
        onContextMenu={e => e.preventDefault()}
        onKeyDown={blockKeys}
        tabIndex="-1"
      />
      {p.children}
    </div>
  )
}

export default Canvas
