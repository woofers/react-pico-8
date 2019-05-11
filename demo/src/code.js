const code = (
  autoPlay, legacyButtons, hideCursor,
  center, blockKeys, usePointer
) => `
  import React from 'react'
  import Pico8 from 'react-pico-8'

  const App = () => {
    return (
      <div>
        <Pico8 src="index.js"
               autoPlay={${autoPlay}}
               legacyButtons={${legacyButtons}}
               hideCursor={${hideCursor}}
               center={${center}}
               blockKeys={${blockKeys}}
               usePointer={${usePointer}}
               placeholder="placeholder.png"
        />
      </div>
    )
  }
`

export default code
