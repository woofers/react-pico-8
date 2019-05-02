/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Pico8 from 'react-pico-8'

const App = () => {
  return (
    <div style={{ background: '#222' }}>
      <div style={{ marginLeft: '500px'}}>
        <Pico8 autoPlay={true} src="index.js" />
      </div>
    </div>
  )
}

export default App
