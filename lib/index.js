if (process.env.NODE_ENV !== 'production') {
  const dev = require('./react-pico-8.dev.js')
  const bundle = {
    default: dev.Pico8,
    Controls: dev.Controls,
    Reset: dev.Reset,
    Pause: dev.Pause,
    Sound: dev.Sound,
    Carts: dev.Carts,
    Fullscreen: dev.Fullscreen
  }
  Object.defineProperty(bundle, '__esModule', {value: !0 })
  module.exports = bundle
}
else {
  const pico = require('./react-pico-8.js')
  const pack = {
    default: pico.Pico8,
    Controls: pico.Controls,
    Reset: pico.Reset,
    Pause: pico.Pause,
    Sound: pico.Sound,
    Carts: pico.Carts,
    Fullscreen: pico.Fullscreen
  }
  Object.defineProperty(pack, '__esModule', {value: !0 })
  module.exports = pack
}
