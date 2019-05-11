/** @jsx jsx */
import { Global, jsx, css } from '@emotion/core'
import { useState } from 'react'
import Pico8 from 'react-pico-8'
import CodeBlock from './code-block'
import codeDemo from './code'

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
    @import url('https://fonts.googleapis.com/css?family=Inconsolata:400,700|Lato:400,700');
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
  const link = css`
    a {
      text-decoration: none;
      color: #FFF;
    }
    a:hover {
      opacity: 0.5;
    }
  `
  const heading = css`
    margin-bottom: 20px;
    a {
      margin-right: 10px;
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
  const [usePointer, setPointer] = useState(true)
  const values = [
    autoPlay,
    legacyButtons,
    hideCursor,
    center,
    blockKeys,
    usePointer
  ]
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
                 usePointer={usePointer}
                 placeholder="placeholder.png"
          /> : null }
        <div css={desc}>
          <span css={[heading, link]}>
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
            <Option name="usePointer" checked={usePointer} onChange={() => setPointer(!usePointer)}>
              If set the pointer hand will be used on buttons.  If un-set a normal cursor will be used on all buttons which do not lead to a new page.
            </Option>
            <h2>State</h2>
            <Option name="isMounted" checked={isMounted} onChange={() => setMounted(!isMounted)}>
              Used to test component mounting and un-mounting.
            </Option>
          </form>
          <h2>Usage</h2>
          <CodeBlock language="jsx">{codeDemo(...values)}</CodeBlock>
          <p>Simply add the game widget to the React application using JSX.</p>
          <p css={link}>
            Be sure to include the <code>.js</code> <code>src</code> of
            the game cartridge generated from <a href="https://lexaloffle.com/pico-8.php">PICO-8</a>'s web export.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
