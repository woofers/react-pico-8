import React, { useEffect } from 'react'
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

const Pico8 = p => {
  const makeScript = (src, onload) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = onload || (() => {})
    script.async = true
    document.body.appendChild(script)
  }
  const run = () => window.p8_run_cart(p.src)
  const start = () => {
    run()
    window.p8_create_audio_context()
  }
  const autoStart = () => {
    const temp_context = new AudioContext()
    temp_context.onstatechange = () => {
      if (temp_context.state == "running") {
        run()
        temp_context.close()
      }
    }
  }
  useEffect(() => {
    makeScript('pico.js', () => makeScript('start.js', p.autoPlay ? autoStart : null))
  })
  const sound = () => {
    window.p8_create_audio_context();
    window.Module.pico8ToggleSound();
  }
  const fullscreen = () => window.p8_request_fullscreen()
  const pause = () => window.Module.pico8TogglePaused()
  const reset = () => window.Module.pico8Reset()
  const context = () => window.Module.pico8ToggleControlMenu()
  const close = () => window.p8_close_cart()
  return (
    <div>
      <canvas id="dummy4itchapp"></canvas>
      <div id="p8_widget">
        <div id="p8_frame">
          <div id="menu_buttons_touch" className="touch_controls_top">
            <div className="p8_menu_button left" id="p8b_full"  onClick={fullscreen}></div>
            <div className="p8_menu_button left" id="p8b_sound" onClick={sound}></div>
            <div className="p8_menu_button right" id="p8b_close" onClick={close}></div>
          </div>
          <div id="p8_container" onClick={start}>
            <div id="p8_start_button" className="p8_start_button">
              <img src="images/start.png"/>
            </div>
            <div id="p8_playarea">
              <div id="touch_controls_background">&nbsp</div>
                <div id="touch_controls_center">
                  <canvas className="emscripten" id="canvas" onContextMenu={(e) => e.preventDefault()} ></canvas>
                  <div id="menu_buttons">
                    <div className="side_buttons p8_menu_button" id="p8b_controls" onClick={context}></div>
                    <div className="side_buttons p8_menu_button" id="p8b_pause" onClick={pause}></div>
                    <div className="side_buttons p8_menu_button" id="p8b_sound" onClick={sound}></div>
                    <div className="side_buttons p8_menu_button" id="p8b_full" onClick={fullscreen}></div>
                  </div>
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
