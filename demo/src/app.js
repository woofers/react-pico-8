import { Global, css } from '@emotion/react'
import { useState } from 'react'
import Pico8 from 'react-pico-8'
import * as picoButtons from 'react-pico-8/buttons'
import CodeBlock from './code-block'
import codeDemo from './code'
import List from './drag-list'
import Box from './checkbox'
import Button from './mount-button'

const span = css`
  padding: 3px;
`

const Checkbox = p => {
  return (
    <div css={span}>
      <Box id={p.name} disabled={p.disabled} checked={p.checked} onChange={p.onChange} />
      <label htmlFor={p.name}>{p.children}</label>
    </div>
  )
}

const style = css`
  color: #fff;
  margin-left: 5px;
`

const Option = p => {
  return (
    <Checkbox name={p.name} disabled={p.disabled} checked={p.checked} onChange={p.onChange}>
      <strong>{p.name}</strong>
      <span css={style}>- {p.children}</span>
    </Checkbox>
  )
}

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
  margin: 0 auto;
  padding: 35px;
  color: #FFF;
  max-width: 1000px;
  fieldset {
    border: none;
  }
  legend {
    display: block;
    font-size: 1.5em;
    font-weight: bold;
    margin: 0 0 5px 0;
  }
  h2 {
    margin-top: 0;
  }
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
const live = css`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`
const list = css`
  flex: 0 400px;
`

const usage = css`
  flex: 0 600px;
`

const App = () => {
  const order = [
    'Controls',
    'Reset',
    'Pause',
    'Sound',
    'Carts',
    'Fullscreen'
  ]
  const [autoPlay, setAutoPlay] = useState(true)
  const [legacyButtons, setLegacyButtons] = useState(false)
  const [hideCursor, setHideCursor] = useState(false)
  const [center, setCenter] = useState(true)
  const [blockKeys, setBlockKeys] = useState(false)
  const [isMounted, setMounted] = useState(true)
  const [usePointer, setPointer] = useState(true)
  const [unpauseOnReset, setUnpauseOnReset] = useState(true)
  const [buttons, setButtons] = useState(order.map(name => ({
    name,
    Button: picoButtons[name],
    enabled: name !== 'Reset' && name !== 'Carts'
  })))
  const props = {
    autoPlay,
    legacyButtons,
    hideCursor,
    center,
    blockKeys,
    usePointer,
    unpauseOnReset
  }
  return (
    <div>
      <div css={page}>
        <Global styles={font} />
        { isMounted ?
          <Pico8 src="/react-pico-8/pico.js" placeholder="/react-pico-8/placeholder.png" {...props}>
            {buttons.filter(({enabled}) => enabled).map(({ name, Button }) => <Button key={name}/>)}
          </Pico8> : null }
        <div css={desc}>
          <span css={[heading, link]}>
            <h1>
              <a href="https://github.com/woofers/react-pico-8">react-pico-8</a>
            </h1>
            <img width="32px" height="32px" src="/react-pico-8/pico.png" alt="PICO-8 Logo" />
          </span>
          <form css={form}>
            <fieldset>
              <legend>Props</legend>
              <Option name="autoPlay" checked={autoPlay} onChange={() => setAutoPlay(!autoPlay)}>
                Indicates if the game canvas should attempt to auto-play on page-load.
              </Option>
              <Option name="legacyButtons" disabled={!isMounted} checked={legacyButtons} onChange={() => setLegacyButtons(!legacyButtons)}>
                Used to select the type of buttons.
              </Option>
              <Option name="hideCursor" disabled={!isMounted} checked={hideCursor} onChange={() => setHideCursor(!hideCursor)}>
                Indicates if the cursor is hidden over the game canvas when the game is playing.
              </Option>
              <Option name="center" disabled={!isMounted} checked={center} onChange={() => setCenter(!center)}>
                Indicates if the game is centred outside of fullscreen mode.
              </Option>
              <Option name="blockKeys" disabled={!isMounted} checked={blockKeys} onChange={() => setBlockKeys(!blockKeys)}>
                If set keys which are used to interact with the game are blocked from scrolling when the game is running.  If un-set keys will only be blocked when the canvas is focused.
              </Option>
              <Option name="usePointer" disabled={!isMounted} checked={usePointer} onChange={() => setPointer(!usePointer)}>
                If set the pointer hand will be used on buttons.  If un-set a normal cursor will be used on all buttons which do not lead to a new page.
              </Option>
              <Option name="unpauseOnReset" disabled={!isMounted} checked={unpauseOnReset} onChange={() => setUnpauseOnReset(!unpauseOnReset)}>
                If set hitting the reset button when paused will instantly reset the game.  Otherwise the game will need to be resumed before it resets.
              </Option>
            </fieldset>
            <fieldset>
              <legend>State</legend>
              <Button mounted={isMounted} onClick={() => setMounted(!isMounted)}/>
            </fieldset>
          </form>
          <div css={live}>
            <div css={list}>
              <List disabled={!isMounted} items={buttons} setItems={setButtons}>Buttons</List>
            </div>
            <div css={usage}>
              <h2>Usage</h2>
              <CodeBlock language="jsx">{codeDemo(...Object.values(props), buttons)}</CodeBlock>
              <p>Simply add the game widget to the React application using JSX.</p>
              <p css={link}>
                Be sure to include the <code>.js</code> <code>src</code> of
                the game cartridge generated from <a href="https://lexaloffle.com/pico-8.php">PICO-8</a>{`'`}s web export.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
