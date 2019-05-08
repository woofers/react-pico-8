/** @jsx jsx */
import { Global, jsx, css } from '@emotion/core'
import { useState, useEffect } from 'react'
import Pico8 from 'react-pico-8'

const Checkbox = p => {
  const span = css`
    padding: 10px;
  `
  const style = css`
    margin-left: 5px;
  `
  return (
    <div css={span}>
      <input id={p.name} type="checkbox" checked={p.checked} onChange={p.onChange} />
      <label css={style} htmlFor={p.name}>{p.children}</label>
    </div>
  )
}

const Option = p => {
  const style = css`
    color: #fff;
    margin-left: 5px;
  `
  return (
    <Checkbox name={p.name} checked={p.checked} onChange={p.onChange}>
      <strong>{p.name}</strong>
      <span css={style}>- {p.children}</span>
    </Checkbox>
  )
}

const App = () => {
  const font = css`
    @import url('https://fonts.googleapis.com/css?family=Lato:400,700');
    * {
      font-family: 'Lato', sans-serif;
    }
    body {
      background: #222;
      margin: 0;
    }
  `
  const desc = css`
    margin: 35px;
    color: #FFF;
  `
  const page = css`
    margin-top: 75px;
  `
  const form = css`
    margin-top: 20px;
  `
  const heading = css`
    margin-bottom: 20px;
    a {
      text-decoration: none;
      color: #FFF;
      margin-right: 10px;
    }
    a:hover {
      opacity: 0.5;
    }
    h1 {
      display: inline;
    }
    img {
      image-rendering: pixelated;
    }
  `
  const [autoPlay, setAutoPlay] = useState(true)
  const [legacyButtons, setLegacyButtons] = useState(false)
  const [hideCursor, setHideCursor] = useState(true)
  const [center, setCenter] = useState(true)
  const [blockKeys, setBlockKeys] = useState(true)
  const [isMounted, setMounted] = useState(true)
  return (
    <div>
      <div css={page}>
        <Global styles={font} />
        { isMounted ?
          <Pico8 src="index.js"
                 autoPlay={autoPlay}
                 legacyButtons={legacyButtons}
                 hideCursor={hideCursor}
                 center={center}
                 blockKeys={blockKeys}
                 placeholder="placeholder.png"
          /> : null }
        <div css={desc}>
          <span css={heading}>
            <h1>
              <a href="https://github.com/woofers/react-pico-8">react-pico-8</a>
            </h1>
            <img width="32px" height="32px" src="pico.png" alt="PICO-8 Logo" />
          </span>
          <form css={form}>
            <h2>Props</h2>
            <Option name="autoPlay" checked={autoPlay} onChange={() => setAutoPlay(!autoPlay)}>
              Indicates if the game canvas should attempt to auto-play on page-load.
            </Option>
            <Option name="legacyButtons" checked={legacyButtons} onChange={() => setLegacyButtons(!legacyButtons)}>
              Used to select the type of buttons.
            </Option>
            <Option name="hideCursor" checked={hideCursor} onChange={() => setHideCursor(!hideCursor)}>
              Indicates if the cursor is hidden over the game canvas when the game is playing.
            </Option>
            <Option name="center" checked={center} onChange={() => setCenter(!center)}>
              Indicates if the game is centred outside of fullscreen mode.
            </Option>
            <Option name="blockKeys" checked={blockKeys} onChange={() => setBlockKeys(!blockKeys)}>
              If set keys which are used to interact with the game are blocked from scrolling when the game is running.  If un-set keys will only be blocked when the canvas is focused.
            </Option>
            <h2>State</h2>
            <Option name="isMounted" checked={isMounted} onChange={() => setMounted(!isMounted)}>
              Used to test component mounting and un-mounting.
            </Option>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
