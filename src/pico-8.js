/** @jsx jsx */
import React, { useState, useEffect, useRef } from 'react'
import { jsx, css } from '@emotion/core'
import { DefaultButtons, Button } from './buttons'
import Start from './start.js'
import Canvas from './canvas.js'
import { startPico, removePico } from './pico.js'
import { blockKeys, keys } from './keys.js'
import { addEvent, removeEvent, setEvent } from './event.js'
import { removeOnFullscreenEvent, onFullscreenEvent, goFullscreen, onFullscreenExit } from './screen.js'

const Pico8 = p => {
  const [isMuted, setMuted] = useState(true)
  const [isMobile, _setMobile] = useState(false)
  const setMobile = (value) => {
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
      if (temp_context.state == "running") {
        setMuted(false)
        setPaused(false)
        setStarted(true)
        run()
        temp_context.close()
      }
    }
  }
  useEffect(() => {
    setEvent("keydown", blockKeys, { passive: false }, hasStarted && p.blockKeys)
  })
  const reset = () => {
    if (isPaused && p.unpauseOnReset) pause()
    setTimeout(window.Module.pico8Reset, 20)
  }
  const onMobile = () => setMobile(true)
  useEffect(() => {
    startPico()
    if (p.autoPlay) autoStart()
    addEvent("keydown", keydown, { passive: false })
    addEvent('touchstart', onMobile, { passive: true })
    onFullscreenEvent(fullscreenChange, false)
    return () => {
      removePico()
      removeEvent("keydown", keydown, { passive: false })
      removeEvent('touchstart', onMobile, { passive: true })
      removeOnFullscreenEvent(fullscreenChange, false)
      removeEvent("keydown", blockKeys, { passive: false })
    }
  // eslint-disable-next-line
  }, [])

  const fullscreenChange = (e) => {
    onFullscreenExit(() => setFullscreen(false))
  }
  const keydown = (e) => {
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
  const hide = css`
    position: absolute;
    visibility: hidden;
    width: 0;
    height: 0;
  `
  const none = css`display: none`;
  const mobileHeader = css`
    position: absolute;
    width: 100%;
    z-index: 10;
    left: 0px;
  `
  const stack = css`
    color: #ccc;
    display: inline-block;
    margin-left: 0px;
    margin-top: 12.5px;
    @media only screen and (min-width: 768px) {
      margin-top: 0px;
      margin-left: 12.5px;
    }
  `
  const inline = css`
    display: flex;
    justify-content: center;
    width: 85vmin;
    max-width: 768px;
  `
  const center = css`
    margin-left: auto;
    margin-right: auto;
  `
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
    <div css={p.css} className={p.className} style={p.style}>
      <canvas css={hide} />
      <div id="p8_container">
        { !hasStarted ? <Start center={p.center} placeholder={p.placeholder} onClick={start} usePointer={p.usePointer} /> : null }
        <div ref={playArea} id="p8_playarea" css={hasStarted ? '' : [hide, none]}>
          <div id="menu_buttons_touch" css={mobileHeader}>
            <Button align="left" button="Sound" on={!isMuted} onClick={sound} hidden={!isMobile || !isFullscreen} />
            <Button align="right" button="Close" onClick={close} hidden={!isMobile || !isFullscreen} />
          </div>
          <div>
            <Canvas legacyButtons={p.legacyButtons} center={p.center}
                    fullscreen={(isMobile && isFullscreen) || isFullscreen}
                    hasStarted={hasStarted} hideCursor={p.hideCursor}
            >
              { !(isMobile || isFullscreen) && hasStarted ?
                <div css={!p.legacyButtons ? stack : ([inline, p.center ? center : ''])}>
                  <Buttons {...buttonData} />
                </div>
              : null}
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  )
}

Pico8.defaultProps = {
  autoPlay: true,
  legacyButtons: false,
  placeholder: '',
  hideCursor: false,
  center: false,
  blockKeys: false,
  usePointer: true,
  unpauseOnReset: true
}

export default Pico8
