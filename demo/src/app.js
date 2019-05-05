/** @jsx jsx */
import { Global, jsx, css } from '@emotion/core'
import { useState, useEffect } from 'react'
import Pico8 from 'react-pico-8'

const Checkbox = p => {
  const span = css`
    padding: 10px;
  `
  const style = css`
    color: #fff;
    margin-left: 5px;
  `
  return (
    <div css={span}>
      <input id={p.name} type="checkbox" checked={p.checked} onChange={p.onChange} />
      <label css={style} for={p.name}>{p.children}</label>
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
  const form = css`
    margin: 35px;
  `
  const page = css`
    margin-top: 75px;
  `
  const [autoPlay, setAutoPlay] = useState(true)
  const [legacyButtons, setLegacyButtons] = useState(false)
  const [hideCursor, setHideCursor] = useState(true)
  const [center, setCenter] = useState(true)
  return (
    <div>
      <div css={page}>
        <Global styles={font} />
        <Pico8 src="index.js"
               autoPlay={autoPlay}
               legacyButtons={legacyButtons}
               hideCursor={hideCursor}
               center={center}
               placeholder="placeholder.png"
        />
        <form css={form}>
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
            Indicates if the game is centred outside of  fullscreen mode.
          </Option>
        </form>
      </div>
    </div>
  )
}

export default App
