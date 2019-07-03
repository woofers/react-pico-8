import React from 'react'
import { Reset, Pause, Fullscreen,
         Sound, Carts, Controls } from './external-buttons'

export { default as LegacyButton } from './legacy-button'
export { default as Button } from './button'

const LegacyButtons = p => (
  <>
    <Reset {...p} />
    <Pause {...p} />
    <Fullscreen {...p} />
    <Sound {...p} />
    <Carts {...p} />
    <Controls {...p} />
  </>
)

const NormalButtons = p => (
  <>
    <Controls {...p} />
    <Pause {...p} />
    <Sound {...p} />
    <Fullscreen {...p} />
  </>
)

export const DefaultButtons = p => p.legacyButtons ? <LegacyButtons {...p} /> : <NormalButtons {...p} />
