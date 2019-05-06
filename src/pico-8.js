/** @jsx jsx */
import { useState, useEffect, useRef } from 'react'
import { jsx, css } from '@emotion/core'
const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
import pico from './pico.js'
const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));
const old = importAll(require.context('./images/old', false, /\.(png|jpe?g|svg)$/));

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
      color: #fff;
    }
    div {
      font-family: verdana;
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
    @media only screen and (min-width: 740px) {
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


const enter = 13
const x = 88
const alt_x = 77
const z = 90
const alt_z = 82
const tab = 9
const space = 32
const arrows = [37, 38, 39, 40]
const keys = [enter, x, alt_x, z, alt_z, tab, space].concat(arrows)
const blockKeys = (e) => {
  if (keys.indexOf(e.keyCode) > -1) e.preventDefault()
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
    const addEvent = (name, func, options) => {
      window.addEventListener(name, func, options)
    }
    const removeEvent = (name, func, options) => {
      window.removeEventListener(name, func, options)
    }
    const setEvent = (name, func, options, value) => {
      removeEvent(name, func, options)
      if (value) {
        addEvent(name, func, options)
      }
    }
    setEvent("keydown", blockKeys, { passive: false }, hasStarted && p.blockKeys)
    if (isMounted) return
    setMounted(true)
    pico()
    if (p.autoPlay) autoStart()
    addEvent("keydown", keydown, { passive: false })
    addEvent('touchstart', () => setMobile(true), { passive: true })
    addEvent('webkitfullscreenchange', fullscreenChange, false);
    addEvent('mozfullscreenchange', fullscreenChange, false);
    addEvent('fullscreenchange', fullscreenChange, false);
    addEvent('MSFullscreenChange', fullscreenChange, false);
  })
  const fullscreenChange = (e) => {
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
  const keydown = (e) => {
    if (keys.indexOf(e.keyCode) > -1) updatePauseButton()
  }
  const updatePauseButton = () => {
    setTimeout(() => setPaused(!!window.pico8_state.is_paused), 120)
  }
  const sound = () => {
    setMuted(!isMuted)
    window.p8_create_audio_context();
    window.Module.pico8ToggleSound();
  }
  const fullscreen = () => {
    setFullscreen(true)
    const area = playArea.current
    if (area.requestFullscreen) {
      area.requestFullscreen()
    }
    else if (area.mozRequestFullScreen) {
      area.mozRequestFullScreen()
    }
    else if (area.webkitRequestFullScreen) {
      area.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
    }
    else if (area.msRequestFullScreen) {
      area.msRequestFullScreen()
    }
  }
  const pause = () => {
    window.Module.pico8TogglePaused()
    updatePauseButton()
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
    @media only screen and (min-width: 740px) {
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
  return (
    <div css={p.css} className={p.className} style={p.style}>
      <canvas css={hide} />
      <div id="p8_container">
        { !hasStarted ? <Start center={p.center} placeholder={p.placeholder} onClick={start} /> : null }
        <div ref={playArea} id="p8_playarea" css={hasStarted ? '' : [hide, none]}>
          <div id="menu_buttons_touch" css={mobileHeader}>
            <Button align="left" id="p8b_sound" on={!isMuted} onClick={sound} hidden={!isMobile || !isFullscreen} />
            <Button align="right" id="p8b_close" onClick={close} hidden={!isMobile || !isFullscreen} />
          </div>
          <div>
            <Canvas legacyButtons={p.legacyButtons} center={p.center}
                    fullscreen={(isMobile && isFullscreen) || isFullscreen}
                    hasStarted={hasStarted} hideCursor={p.hideCursor}
            >
              { !(isMobile || isFullscreen) && hasStarted ?
                ( !p.legacyButtons ?
                  <div css={stack}>
                    <Button id="p8b_controls" onClick={context} />
                    <Button id="p8b_pause" on={isPaused} onClick={pause} />
                    <Button id="p8b_sound" on={!isMuted} onClick={sound} />
                    <Button id="p8b_full" onClick={fullscreen} />
                  </div>
                  :
                  <div css={[inline, p.center ? center : '']}>
                    <OldButton button="Reset" onClick={reset} />
                    <OldButton button="Pause" onClick={pause} />
                    <OldButton button="Fullscreen" alt="Toggle Fullscreen" onClick={fullscreen} />
                    <OldButton button="Sound" onClick={sound} />
                    <OldButton button="Carts" alt="More Carts" onClick="http://www.lexaloffle.com/bbs/?cat=7&sub=2" />
                    <OldButton button="Controls" onClick={context} />
                  </div>
                ) : null }
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
  hideCursor: true,
  center: false,
  blockKeys: true
}

export default Pico8
