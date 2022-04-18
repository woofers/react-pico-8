import {
  Pico8 as Pico8Dev,
  DevControls,
  DevReset,
  DevPause,
  DevSound,
  DevCarts,
  DevFullscreen
} from './react-pico-8.module.dev.js'
import {
  Pico8,
  ProdControls,
  ProdReset,
  ProdPause,
  ProdSound,
  ProdCarts,
  ProdFullscreen
} from './react-pico-8.module.js'

export default process.env.NODE_ENV === 'production' ? Pico8 : Pico8Dev

export const Controls = process.env.NODE_ENV === 'production' ? ProdControls : DevControls
export const Reset = process.env.NODE_ENV === 'production' ? ProdReset : DevReset
export const Pause = process.env.NODE_ENV === 'production' ? ProdPause : DevPause
export const Sounds = process.env.NODE_ENV === 'production' ? ProdSounds : DevSounds
export const Carts = process.env.NODE_ENV === 'production' ? ProdCarts : DevCarts
export const Fullscreen = process.env.NODE_ENV === 'production' ? ProdFullscreen : DevFullscreen
