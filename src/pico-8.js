import React, { useRef, useState, useEffect } from 'react'
import './style.css'

const OldButton = p => {
  const isFunction = () => typeof p.onClick === 'function'
  const onClick = () => {
    if (!isFunction()) return null
    return p.onClick
  }
  const Link = ({ children }) => {
    if (isFunction()) return children
    return (<a className="old_buttons" target="_new" href={p.onClick}>{children}</a>)
  }
  return (
    <Link>
      <div className={isFunction() ? 'old_buttons' : null} onClick={onClick()}>
        <img width="12px" height="12px" src={`images/old/${p.button.toLowerCase()}.png`} alt={p.alt || p.button} />
        {' '}{p.button}
      </div>
    </Link>
 )
}

const Button = p => {
  let image = p.id
  if (p.id === 'p8b_sound' || p.id === 'p8b_pause') {
    image += p.on ? '1' : '0'
  }
  if (p.hidden) return null
  return (
    <div className={`${p.className} side_buttons p8_menu_button`} id={p.id} onClick={p.onClick}>
      <img src={`images/${image}.png`} style={{ pointerEvents: 'none' }} />
    </div>
  )
}

const Pico8 = p => {
  const [isMuted, setMuted] = useState(true)
  const [isMobile, setMobile] = useState(false)
  const [isPaused, setPaused] = useState(true)
  const [isFullscreen, setFullscreen] = useState(false)
  const [hasStarted, setStarted] = useState(false)
  const [isMounted, setMounted] = useState(false)
  const makeScript = (src, onload) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = onload || (() => {})
    script.async = true
    document.body.appendChild(script)
  }
  const run = () => window.p8_run_cart(p.src)
  const start = () => {
    if (hasStarted) return
    setMuted(false)
    setPaused(false)
    setStarted(true)
    run()
    window.p8_create_audio_context()
    console.log('yoo')
  }
  const autoStart = () => {
    const temp_context = new AudioContext()
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
    if (isMounted) return
    setMounted(true)
    makeScript('pico.js', () => makeScript('start.js', p.autoPlay ? autoStart : null))
    window.addEventListener('touchstart', () => setMobile(true), { passive: true })
    const fullscreenChange = (e) => {
      setFullscreen(!isFullscreen)
      const events = [
        document.webkitIsFullScreen,
        document.mozFullScreen,
        document.msFullscreenElement,
        document.fullscreenElement
      ]
      for (const event of events) {
        if (event === false) {
          setFullscreen(false)
          return
        }
      }
    }
    window.addEventListener('webkitfullscreenchange', fullscreenChange, false);
    window.addEventListener('mozfullscreenchange', fullscreenChange, false);
    window.addEventListener('fullscreenchange', fullscreenChange, false);
    window.addEventListener('MSFullscreenChange', fullscreenChange, false);
  })
  const sound = () => {
    setMuted(!isMuted)
    window.p8_create_audio_context();
    window.Module.pico8ToggleSound();
  }
  const fullscreen = () => {
    setFullscreen(true)
    window.p8_request_fullscreen()
  }
  const pause = () => {
    setPaused(!isPaused)
    window.Module.pico8TogglePaused()
  }
  const reset = () => window.Module.pico8Reset()
  const context = () => window.Module.pico8ToggleControlMenu()
  const close = () => {
    setStarted(false)
    setMuted(false)
    setPaused(false)
    setMobile(false)
    window.p8_close_cart()
  }
  return (
    <div>
      <canvas id="dummy4itchapp"></canvas>
      <div id="p8_widget">
        <div id="p8_frame">
          <div id="menu_buttons_touch" className="touch_controls_top">
            <Button className="p8_menu_button left" id="p8b_full" onClick={fullscreen} hidden={!isMobile} />
            <Button className="p8_menu_button left" id="p8b_sound" on={!isMuted} onClick={sound} hidden={!isMobile} />
            <Button className="p8_menu_button right" id="p8b_close" onClick={close} hidden={!isMobile} />
          </div>
          <div id="p8_container" onClick={start}>
            <div id="p8_start_button" className="p8_start_button">
              <img src="images/start.png"/>
            </div>
            <div id="p8_playarea">
              <div id="touch_controls_background">&nbsp</div>
              <div class="game">
                <canvas className="emscripten" id="canvas" onContextMenu={(e) => e.preventDefault()} />
                <div id="menu_buttons">
                  <Button id="p8b_controls" onClick={context} hidden={isMobile || isFullscreen} />
                  <Button id="p8b_pause" on={isPaused} onClick={pause} hidden={isMobile || isFullscreen} />
                  <Button id="p8b_sound" on={!isMuted} onClick={sound} hidden={isMobile || isFullscreen} />
                  <Button id="p8b_full" onClick={fullscreen} hidden={isMobile || isFullscreen} />
                </div>
              </div>
                <div id="touch_controls_center">
                </div>
                <div id="touch_controls_gfx">
                  <img src="" className="controls" id="controls_right_panel"/>
                  <img src="" className="controls" id="controls_left_panel"/>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Pico8
