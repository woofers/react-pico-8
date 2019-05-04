/** @jsx jsx */
import { useState, useEffect } from 'react'
import { jsx, css } from '@emotion/core'
const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));
const old = importAll(require.context('./images/old', false, /\.(png|jpe?g|svg)$/));
import pico from './pico.js'
import startPico from './start.js'

const OldButton = p => {
  const style = css`
    float: left;
    width: 100%;
    min-height: 16px;
    display: inline-block;
    margin: 1px;
    padding: 4px;
    text-align: center;
    color: #fff;
    background-color: #777;
    font-family: verdana;
    font-size: 9pt;
    cursor: pointer;
    cursor: hand;
    text-decoration: none;
    a {
      color:#fff;
    }
   &:link,
   &:hover {
     background-color: #aaa;
   }
  `
  const isFunction = () => typeof p.onClick === 'function'
  const onClick = () => {
    if (!isFunction()) return null
    return p.onClick
  }
  const Link = ({ children }) => {
    if (isFunction()) return children
    return (<a css={style} target="_new" href={p.onClick}>{children}</a>)
  }
  return (
    <Link>
      <div css={isFunction() ? style : null} onClick={onClick()}>
        <img width="12px" height="12px" src={old[`${p.button.toLowerCase()}.png`]} alt={p.alt || p.button} />
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
    display: table;
    width: 24px;
    height: 24px;
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

const Canvas = p => {
  const fullscreen = css`
    width: 100vmin;
    height: 100vmin;
  `
  const normal = css`
    width: 85vmin;
    height: 85vmin;
    max-width: 768px;
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
  `
  const center = css`
    text-align: center;
  `
  return (
    <div css={p.fullscreen ? center : ''}>
      <canvas css={[canvas, p.fullscreen ? fullscreen : normal]}
              className="emscripten"
              id="canvas"
              onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  )
}

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
  return (
    <div css={style} onClick={p.onClick} id="p8_start_button">
      <img alt="Play Game" src={images['start.png']}/>
    </div>
  )
}

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
  const [isMounted, setMounted] = useState(false)
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
    makeScript(pico)
    makeScript(startPico)
    if (p.autoPlay) autoStart()
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
    window.addEventListener("keydown", keydown, { passive: false });
  })
  const keydown = (e) => {
    e = e || window.event;
    const enter = 13
    const x = 88
    const z = 90
    const keys = [enter, x, z]
    if (keys.indexOf(e.keyCode) > -1) updatePauseButton()
  }
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
    window.Module.pico8TogglePaused()
    updatePauseButton()
  }
  const updatePauseButton = () => {
    setTimeout(() => setPaused(!!window.pico8_state.is_paused), 120)
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
  const hide = css`
    position: absolute;
    visibility: hidden;
    width: 0;
    height: 0;
  `
  const mobileHeader = css`
    position: absolute;
    width: 100%;
    z-index: 10;
    left: 0px;
  `
  const stack = css`
    color: #ccc;
    display: inline-block;
    margin-left: 12.5px;
  `
  const inline = css`
    display: flex;
    justify-content: center;
    width: 85vmin;
    max-width: 768px;
  `
  return (
    <div css={p.css} className={p.className} style={p.style}>
      <canvas css={hide} />
      <div id="p8_container">
        { !hasStarted ? <Start placeholder={p.placeholder} onClick={start} /> : null }
        <div id="p8_playarea">
          <div id="menu_buttons_touch" css={mobileHeader}>
            <Button align="left" id="p8b_sound" on={!isMuted} onClick={sound} hidden={!isMobile || !isFullscreen} />
            <Button align="right" id="p8b_close" onClick={close} hidden={!isMobile || !isFullscreen} />
          </div>
          <div>
            <Canvas fullscreen={(isMobile && isFullscreen) || isFullscreen} hasStarted={hasStarted} hideCursor={p.hideCursor} />
              { !(isMobile || isFullscreen) && hasStarted ?
                ( !p.legacyButtons ?
                  <div css={stack}>
                    <Button id="p8b_controls" onClick={context} />
                    <Button id="p8b_pause" on={isPaused} onClick={pause} />
                    <Button id="p8b_sound" on={!isMuted} onClick={sound} />
                    <Button id="p8b_full" onClick={fullscreen} />
                  </div>
                  :
                  <div css={inline}>
                    <OldButton button="Reset" onClick={reset} />
                    <OldButton button="Pause" onClick={pause} />
                    <OldButton button="Fullscreen" alt="Toggle Fullscreen" onClick={fullscreen} />
                    <OldButton button="Sound" onClick={sound} />
                    <OldButton button="Carts" alt="More Carts" onClick="http://www.lexaloffle.com/bbs/?cat=7&sub=2" />
                    <OldButton button="Controls" onClick={context} />
                  </div>
                ) : null }
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
  hideCursor: true
}

export default Pico8
