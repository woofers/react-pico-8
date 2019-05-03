/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Pico8 from 'react-pico-8'

const App = () => {
  const full = css`
    background: #222;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 1;
  `
  return (
    <div css={full}>
      <Pico8 autoPlay={true} src="index.js" legacyButtons={false} placeholder="placeholder.png" />
    </div>
  )
}

export default App
