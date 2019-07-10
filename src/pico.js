import { hasWindow } from './window'

// The following code has been adapted to work with react-pico-8.
// File generated from default PICO-8 web export.

const init = () => {
  // Default shell for PICO-8 0.1.12

  // options

  // p8_autoplay true to boot the cartridge automatically after page load when possible
  // if the browser can not create an audio context outside of a user gesture (e.g. on iOS), p8_autoplay has no effect
  window.p8_autoplay = false

  // When pico8_state is defined, PICO-8 will set .is_paused, .sound_volume and .frame_number each frame
  // (used for determining button icons)
  window.pico8_state = []

  // When pico8_buttons is defined, PICO-8 reads each int as a bitfield holding that player's button states
  // 0x1 left, 0x2 right, 0x4 up, 0x8 right, 0x10 O, 0x20 X, 0x40 menu
  // (used by p8_update_gamepads)
  window.pico8_buttons = [0, 0, 0, 0, 0, 0, 0, 0] // max 8 players

  // used to display number of detected joysticks
  window.pico8_gamepads = { count: 0 }

  // When pico8_mouse is defined, PICO-8 reads the 3 integers as X, Y and a bitfield for buttons: 0x1 LMB, 0x2 RMB
  window.pico8_mouse = [0, 0, 0]

  // When pico8_gpio is defined, reading and writing to gpio pins will read and write to these values
  window.pico8_gpio = new Array(128)

  // When pico8_audio_context context is defined, the html shell (this file) is responsible for creating and managing it
  // Otherwise, PICO-8 will create its own one
  window.p8_touch_detected = false

  // Set canvas for game module
  window.Module = { canvas: document.getElementById("canvas") }

  // Indicate that the game instance is not running
  // by default
  window.p8_is_running = false

  // Clear PICO-8 script tag
  if (window.p8_script) document.body.removeChild(window.p8_script)
  window.p8_script = null

  // Clear game audio context
  if (window.pico8_audio_context) window.pico8_audio_context.close()
  window.pico8_audio_context = null
}


const onTouch = (e) => window.p8_touch_detected = true

export const startPico = () => {
  if (!hasWindow()) return
  init()
  window.addEventListener("touchstart", onTouch, { passive: true })
  window.p8_create_audio_context = () => {
    if (window.pico8_audio_context) {
      window.pico8_audio_context.resume()
      return
    }
    window.webAudioAPI =
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext ||
      window.msAudioContext
    if (window.webAudioAPI) {
      window.pico8_audio_context = new webAudioAPI()
      if (window.pico8_audio_context) {
        window.source_sfx = pico8_audio_context.createBufferSource()
        window.source_sfx.buffer = pico8_audio_context.createBuffer(
          1,
          1,
          22050
        ) // dummy
        window.source_sfx.connect(pico8_audio_context.destination)
        window.source_sfx.start(1, 0.25)
      }
    }
  }

  // just hides. can reopen in a paused state.
  window.p8_close_cart = () => {
    window.p8_is_running = false
    window.p8_touch_detected = false
    window.Module.pico8SetPaused(1)
  }

  window.p8_run_cart = src => {
    if (window.p8_is_running) return
    window.p8_is_running = true

    // create audio context and wake it up (for iOS -- needs happen inside touch event)
    window.p8_create_audio_context()

    window.p8_script = document.createElement("script")
    window.p8_script.type = "application/javascript"
    window.p8_script.src = src

    // load and run
    document.body.appendChild(window.p8_script)

    // add #playing for touchscreen devices (allows back button to close)
    if (window.p8_touch_detected) {
      window.location.hash = "#playing"
      window.onhashchange = () => {
        if (window.location.hash.search("playing") < 0) window.p8_close_cart()
      }
    }
  }
}

export const removePico = () => {
  if (!hasWindow()) return
  window.removeEventListener("touchstart", onTouch, { passive: true })
  init()
}
