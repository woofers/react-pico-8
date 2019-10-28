const spaces = indent => {
  const tab = 2
  return ' '.repeat(tab * indent)
}

const tags = buttons => {
  if (buttons.length === 0) return '/>'
  const items = buttons.map(({ name }) => `${spaces(2)}<${name}/>`).join('\n')
  return `>
${items}
  </Pico8>`
}

const imports = buttons => {
  const defaultImports = `
import React from 'react'
import Pico8 from 'react-pico-8'`

  if (buttons.length === 0) return defaultImports
  const names = buttons.map(({ name }) => name).join(`,\n${spaces(4)} `)
  return `${defaultImports}
import { ${names} } from 'react-pico-8/buttons'`
}

const code = (
  autoPlay, legacyButtons, hideCursor,
  center, blockKeys, usePointer, unpauseOnReset, buttons
) => {
  const enabled = buttons.filter(({ enabled }) => enabled)
  return `${imports(enabled)}

const App = () => (
  <Pico8 src="index.js"
         autoPlay={${autoPlay}}
         legacyButtons={${legacyButtons}}
         hideCursor={${hideCursor}}
         center={${center}}
         blockKeys={${blockKeys}}
         usePointer={${usePointer}}
         unpauseOnReset={${unpauseOnReset}}
         placeholder="placeholder.png"
  ${tags(enabled)}
)`
}

export default code
