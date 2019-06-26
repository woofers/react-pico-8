import { Reset, Pause, Fullscreen, Sound, Carts, Controls } from './external-buttons'
export { default as LegacyButton } from './legacy-button'
export { default as Button } from './button'

export const defaultLegacy = [Reset, Pause, Fullscreen, Sound, Carts, Controls]

export const defaultButtons = [Controls, Pause, Sound, Fullscreen]
