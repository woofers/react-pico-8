
// The following code has been adapted to work with react-pico-8.
// File generated from default PICO-8 web export.

// Default shell for PICO-8 0.1.12

// options

// p8_autoplay true to boot the cartridge automatically after page load when possible
// if the browser can not create an audio context outside of a user gesture (e.g. on iOS), p8_autoplay has no effect
var p8_autoplay = false;

// When pico8_state is defined, PICO-8 will set .is_paused, .sound_volume and .frame_number each frame
// (used for determining button icons)
var pico8_state = [];

// When pico8_buttons is defined, PICO-8 reads each int as a bitfield holding that player's button states
// 0x1 left, 0x2 right, 0x4 up, 0x8 right, 0x10 O, 0x20 X, 0x40 menu
// (used by p8_update_gamepads)
var pico8_buttons = [0, 0, 0, 0, 0, 0, 0, 0]; // max 8 players

// used to display number of detected joysticks
var pico8_gamepads = {};
pico8_gamepads.count = 0;

// When pico8_mouse is defined, PICO-8 reads the 3 integers as X, Y and a bitfield for buttons: 0x1 LMB, 0x2 RMB
// var pico8_mouse = [0,0,0];

// When pico8_gpio is defined, reading and writing to gpio pins will read and write to these values
// var pico8_gpio = new Array(128);

// When pico8_audio_context context is defined, the html shell (this file) is responsible for creating and managing it
// Otherwise, PICO-8 will create its own one
var pico8_audio_context;
var p8_touch_detected = false;

addEventListener(
  "touchstart",
  function(event) {
    p8_touch_detected = true;
  },
  { passive: true }
);

function p8_create_audio_context() {
  if (pico8_audio_context) {
    pico8_audio_context.resume();
    return;
  }
  var webAudioAPI =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext;
  if (webAudioAPI) {
    pico8_audio_context = new webAudioAPI();
    if (pico8_audio_context) {
      var source_sfx = pico8_audio_context.createBufferSource();
      source_sfx.buffer = pico8_audio_context.createBuffer(1, 1, 22050); // dummy
      source_sfx.connect(pico8_audio_context.destination);
      source_sfx.start(1, 0.25);
      //source_sfx.noteOn(0);
    }
  }
}

// just hides. can reopen in a paused state.
function p8_close_cart() {
  p8_is_running = false;
  p8_touch_detected = false;
  Module.pico8SetPaused(1);
}

var p8_is_running = false;
var p8_script = null;
var Module = null;
function p8_run_cart(src) {
  if (p8_is_running) return;
  p8_is_running = true;

  // create audio context and wake it up (for iOS -- needs happen inside touch event)
  p8_create_audio_context();

  // load and run script
  e = document.createElement("script");
  p8_script = e;
  e.onload = function() {
    // show canvas / menu buttons only after loading
    el = document.getElementById("p8_playarea");
    if (el) el.style.display = "table";
  };
  e.type = "application/javascript";
  e.src = src;
  e.id = "e_script";

  document.body.appendChild(e); // load and run

  // add #playing for touchscreen devices (allows back button to close)
  if (p8_touch_detected) {
    window.location.hash = "#playing";
    window.onhashchange = function() {
      if (window.location.hash.search("playing") < 0) p8_close_cart();
    };
  }
}

// key blocker. prevent cursor keys from scrolling page while playing cart.
// also don't act on M, R so that can mute / reset cart
document.addEventListener(
  "keydown",
  function(event) {
    event = event || window.event;
    if (!p8_is_running) return;
    if (pico8_state.has_focus == 1)
      if ([32, 37, 38, 39, 40, 77, 82, 9].indexOf(event.keyCode) > -1)
        if (event.preventDefault)
          // cursors, M R, tab
          event.preventDefault();
  },
  { passive: false }
);

function p8_request_fullscreen() {
  var is_fullscreen =
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitIsFullScreen ||
    document.msFullscreenElement;

  if (is_fullscreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    return;
  }

  var el = document.getElementById("p8_playarea");

  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  }
}
