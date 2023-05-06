import React, { useState, useEffect, useRef } from 'react'
import { DefaultButtons, Button } from './buttons'
import Start from './start.js'
import Canvas from './canvas.js'
import { startPico, removePico } from './pico.js'
import { blockKeys, keys } from './keys.js'
import { addEvent, removeEvent, setEvent } from './event.js'
import {
  removeOnFullscreenEvent,
  onFullscreenEvent,
  goFullscreen,
  onFullscreenExit
} from './screen.js'
import classes from './classnames'
import styles from './index.module.css'

const cx = classes.bind(styles)

export {
  Controls,
  Reset,
  Pause,
  Sound,
  Carts,
  Fullscreen
} from './external-buttons'


const defaultProps = {
  autoPlay: true,
  legacyButtons: false,
  placeholder: '',
  hideCursor: false,
  center: false,
  blockKeys: false,
  usePointer: true,
  unpauseOnReset: true
}

export const Pico8 = ({ className, css, ...restProps }) => {
  const p = { ...defaultProps, ...restProps }
  const [isMuted, setMuted] = useState(true)
  const [isMobile, _setMobile] = useState(false)
  const setMobile = value => {
    _setMobile(value)
    if (value) setTimeout(fullscreen, 100)
  }
  const [isPaused, setPaused] = useState(true)
  const [isFullscreen, setFullscreen] = useState(false)
  const [hasStarted, setStarted] = useState(false)
  const makeScript = (src, onload) => {
    const script = document.createElement('script')
    script.textContent = src
    document.head.appendChild(script)
  }
  const run = () => window.p8_run_cart(p.src)
  const start = () => {
    if (hasStarted) return
    setMuted(false)
    setPaused(false)
    setStarted(true)
    run()
    window.p8_create_audio_context()
  }
  const autoStart = () => {
    const temp_context = (() => {
      var AC
      if (typeof window !== 'undefined') {
        AC = window.AudioContext || window.webkitAudioContext
      }
      return AC ? new AC() : {}
    })()
    temp_context.onstatechange = () => {
      if (temp_context.state == 'running') {
        setMuted(false)
        setPaused(false)
        setStarted(true)
        run()
        temp_context.close()
      }
    }
  }
  useEffect(() => {
    setEvent(
      'keydown',
      blockKeys,
      { passive: false },
      hasStarted && p.blockKeys
    )
  })
  const reset = () => {
    if (isPaused && p.unpauseOnReset) pause()
    setTimeout(window.Module.pico8Reset, 20)
  }
  const onMobile = () => {
    if (isMobile) return
    setMobile(true)
  }
  useEffect(() => {
    startPico()
    if (p.autoPlay) autoStart()
    addEvent('keydown', keydown, { passive: false })
    addEvent('touchstart', onMobile, { passive: true })
    onFullscreenEvent(fullscreenChange, false)
    return () => {
      removePico()
      removeEvent('keydown', keydown, { passive: false })
      removeEvent('touchstart', onMobile, { passive: true })
      removeOnFullscreenEvent(fullscreenChange, false)
      removeEvent('keydown', blockKeys, { passive: false })
    }
    // eslint-disable-next-line
  }, [])

  const fullscreenChange = e => {
    onFullscreenExit(() => setFullscreen(false))
  }
  const keydown = e => {
    if (keys.indexOf(e.keyCode) > -1) updatePauseButton()
  }
  const updatePauseButton = () => {
    setTimeout(() => setPaused(!!window.pico8_state.is_paused), 120)
  }
  const sound = () => {
    setMuted(!isMuted)
    window.p8_create_audio_context()
    window.Module.pico8ToggleSound()
  }
  const fullscreen = () => {
    setFullscreen(true)
    goFullscreen(playArea.current)
  }
  const pause = () => {
    window.Module.pico8TogglePaused()
    updatePauseButton()
  }
  const controls = () => {
    window.Module.pico8ToggleControlMenu()
    updatePauseButton()
  }
  const close = () => {
    setStarted(false)
    setMuted(false)
    setPaused(false)
    setMobile(false)
    window.p8_close_cart()
  }
  const playArea = useRef()
  const { usePointer, legacyButtons } = p
  const Buttons = b => {
    let buttons = p.children
    if (!buttons || buttons.length <= 0) return <DefaultButtons {...b} />
    return React.Children.map(buttons, B => React.cloneElement(B, b))
  }
  const buttonData = {
    usePointer,
    legacyButtons,
    isPaused,
    isMuted,
    pause,
    fullscreen,
    sound,
    controls,
    reset
  }
  return (
    <div css={css} className={className} style={p.style}>
      <canvas className={styles.hide} />
      <div id="p8_container">
        {!hasStarted ? (
          <Start
            center={p.center}
            placeholder={p.placeholder}
            onClick={start}
            usePointer={p.usePointer}
          />
        ) : null}
        <div
          ref={playArea}
          id="p8_playarea"
          className={cx({ hide: !hasStarted, none: !hasStarted })}
        >
          <div id="menu_buttons_touch" className={styles['mobile-header']}>
            <Button
              align="left"
              button="Sound"
              onTitle="Mute"
              title="Unmute"
              on={!isMuted}
              onClick={sound}
              hidden={!isMobile || !isFullscreen}
            />
            <Button
              align="right"
              button="Close"
              title="Close"
              onClick={close}
              hidden={!isMobile || !isFullscreen}
            />
          </div>
          <div>
            <Canvas
              legacyButtons={p.legacyButtons}
              center={p.center}
              fullscreen={(isMobile && isFullscreen) || isFullscreen}
              hasStarted={hasStarted}
              hideCursor={p.hideCursor}
            >
              {!(isMobile || isFullscreen) && hasStarted ? (
                <div
                  className={cx({
                    stack: !p.legacyButtons,
                    inline: p.legacyButtons,
                    center: p.legacyButtons && p.center
                  })}
                >
                  <Buttons {...buttonData} />
                </div>
              ) : null}
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  )
}

