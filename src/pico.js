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

function p8_gfx(i) {
  return `images/${i}.png`;
}

function p8_update_button_icons() {
  // regenerate every frame (shouldn't be expensive?)
  els = document.getElementsByClassName("p8_menu_button");
  for (i = 0; i < els.length; i++) {
    el = els[i];
    index = el.id;
    if (index == "p8b_sound")
      index += pico8_state.sound_volume == 0 ? "0" : "1"; // 1 if undefined
    if (index == "p8b_pause") index += pico8_state.is_paused > 0 ? "1" : "0"; // 0 if undefined
    new_str =
      '<img width=24 height=24 style="pointer-events:none" src="' +
      p8_gfx(index) +
      '">';
    if (el.innerHTML != new_str) el.innerHTML = new_str;

    // hide all buttons for touch mode (can pause with menu buttons)

    var is_visible = p8_is_running;

    if (!p8_touch_detected && el.parentElement.id == "menu_buttons_touch")
      is_visible = false;
    if (p8_touch_detected && el.parentElement.id == "menu_buttons")
      is_visible = false;

    var is_fullscreen =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitIsFullScreen ||
      document.msFullscreenElement;
    if (is_fullscreen) is_visible = false;

    if (is_visible) el.style.display = "";
    else el.style.display = "none";
  }
  requestAnimationFrame(p8_update_button_icons);
}

function abs(x) {
  return x < 0 ? -x : x;
}

// step 0 down 1 drag 2 up
function pico8_buttons_event(e, step) {
  if (!p8_is_running) return;

  pico8_buttons[0] = 0;

  var num = 0;
  if (e.touches) num = e.touches.length;

  for (var i = 0; i < num; i++) {
    var touch = null;

    touch = e.touches[i];
    //tindex = touch.identifier;
    var x = touch.clientX;
    var y = touch.clientY;

    // same as svg drawing
    var w = window.innerWidth;
    var h = window.innerHeight;

    var r = Math.min(w, h) / 12;
    if (r > 40) r = 40;

    b = 0;

    if (y < h - r * 8) {
      // no controller buttons up here; includes canvas and menu buttons at top in touch mode
    } else if (y < h - r * 6 && y > h - r * 8) {
      // menu button: half as high as X O button
      // stretch across right-hand half above X O buttons
      if (x > w - r * 3) b |= 0x40;
    } else if (x < w / 2 && x < r * 6) {
      // stick

      mask = 0xf; // dpad
      var cx = 0 + r * 3;
      var cy = h - r * 3;

      deadzone = r / 3;
      var dx = x - cx;
      var dy = y - cy;

      if (abs(dx) > abs(dy) * 0.6) {
        // horizontal
        if (dx < -deadzone) b |= 0x1;
        if (dx > deadzone) b |= 0x2;
      }
      if (abs(dy) > abs(dx) * 0.6) {
        // vertical
        if (dy < -deadzone) b |= 0x4;
        if (dy > deadzone) b |= 0x8;
      }
    } else if (x > w - r * 6) {
      // button; diagonal split from bottom right corner

      mask = 0x30;

      // one or both of [X], [O]
      if (h - y > (w - x) * 0.8) b |= 0x10;
      if (w - x > (h - y) * 0.8) b |= 0x20;
    }
    pico8_buttons[0] |= b;
  }
}

// call this every frame --  browser is supposed to handle redundant changes, right?
// otherwise difficult to catch every case layout needs to be updated
function p8_update_layout() {
  var canvas = document.getElementById("canvas");
  var p8_playarea = document.getElementById("p8_playarea");
  var p8_container = document.getElementById("p8_container");
  var p8_frame = document.getElementById("p8_frame");
  var csize = 512;
  var margin_top = 0;
  var margin_left = 0;

  // page didn't load yet? first call should be after p8_frame is created
  if (!canvas || !p8_playarea || !p8_container || !p8_frame) {
    requestAnimationFrame(p8_update_layout);
    return;
  }

  // assumes frame doesn't have padding

  var is_fullscreen =
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitIsFullScreen ||
    document.msFullscreenElement;
  var frame_width = p8_frame.offsetWidth;
  var frame_height = p8_frame.offsetHeight;

  if (is_fullscreen) {
    // same as window
    frame_width = window.innerWidth;
    frame_height = window.innerHeight;
  } else {
    // never larger than window  // (happens when address bar is down in portraight mode on phone)
    frame_width = Math.min(frame_width, window.innerWidth);
    frame_height = Math.min(frame_height, window.innerHeight);
  }

  // as big as will fit in a frame..
  csize = Math.min(frame_width, frame_height);

  // .. but never more than 2/3 of longest side for touch (e.g. leave space for controls on iPad)
  if (p8_touch_detected && p8_is_running) {
    var longest_side = Math.max(window.innerWidth, window.innerHeight);
    csize = Math.min(csize, (longest_side * 2) / 3);
  }

  // pixel perfect: quantize to closest multiple of 128
  // only when large display (desktop)
  if (frame_width >= 512 && frame_height >= 512) {
    csize = (csize + 1) & ~0x7f;
  }

  if (is_fullscreen) {
    // always center horizontally
    margin_left = (frame_width - csize) / 2;

    if (p8_touch_detected) {
      if (window.innerWidth < window.innerHeight) {
        // portrait: keep at y=40 (avoid rounded top corners / camer num thing etc.)
        margin_top = Math.min(40, frame_height - csize);
      } else {
        // landscape: put a little above vertical center
        margin_top = (frame_height - csize) / 4;
      }
    } else {
      // non-touch: center vertically
      margin_top = (frame_height - csize) / 2;
    }
  }

  // mobile in portrait mode: put screen at top (w / a little space for fullscreen button)
  // (don't cart about buttons overlapping screen)
  if (
    p8_touch_detected &&
    p8_is_running &&
    document.body.clientWidth < document.body.clientHeight
  )
    p8_playarea.style.marginTop = 32;
  else if (p8_touch_detected && p8_is_running)
    // landscape: slightly above vertical center (only relevant for iPad / highres devices)
    p8_playarea.style.marginTop = (document.body.clientHeight - csize) / 4;
  else p8_playarea.style.marginTop = "";

  canvas.style.width = csize;
  canvas.style.height = csize;

  // to do: this should just happen from css layout
  canvas.style.marginLeft = margin_left;
  canvas.style.marginTop = margin_top;

  p8_container.style.width = csize;
  p8_container.style.height = csize;

  // set menu buttons position to bottom right
  el = document.getElementById("menu_buttons");
  el.style.marginTop = csize - el.offsetHeight;

  if (p8_touch_detected && p8_is_running) {
    // turn off pointer events to prevent double-tap zoom etc (works on Android)
    // don't want this for desktop because breaks mouse input & click-to-focus when using codo_textarea
    canvas.style.pointerEvents = "none";

    p8_container.style.marginTop = "0px";

    // buttons

    // same as touch event handling
    var w = window.innerWidth;
    var h = window.innerHeight;

    // doesn't work -- viewport changes size according to
    //var w = document.body.clientWidth;
    //var h = document.body.clientHeight;

    var r = Math.min(w, h) / 12;

    if (r > 40) r = 40;

    el = document.getElementById("controls_right_panel");
    el.style.left = w - r * 6;
    el.style.top = h - r * 7;
    el.style.width = r * 6;
    el.style.height = r * 7;
    if (el.getAttribute("src") != p8_gfx("controls_right_panel"))
      // optimisation: avoid reload? (browser should handle though)
      el.setAttribute("src", p8_gfx("controls_right_panel"));

    el = document.getElementById("controls_left_panel");
    el.style.left = 0;
    el.style.top = h - r * 6;
    el.style.width = r * 6;
    el.style.height = r * 6;
    if (el.getAttribute("src") != p8_gfx("controls_left_panel"))
      // optimisation: avoid reload? (browser should handle though)
      el.setAttribute("src", p8_gfx("controls_left_panel"));

    // scroll to cart (need to stop running with X)
    p8_frame.scrollIntoView(true);

    document.getElementById("touch_controls_gfx").style.display = "table";
    document.getElementById("touch_controls_background").style.display = "table";
    document.getElementById("p8_container").style.marginLeft = "auto";
    document.getElementById("p8_container").style.marginRight = "auto";
    document.getElementById("p8_container").style.marginBottom = "auto";
    document.getElementById("p8_widget").style.margin = "auto";
  } else {
    document.getElementById("touch_controls_gfx").style.display = "none";
    document.getElementById("touch_controls_background").style.display = "none";
    document.getElementById("p8_container").style.margin = "0";
    document.getElementById("p8_widget").style.margin = "0";
  }

  if (!p8_is_running) {
    p8_playarea.style.display = "none";
    p8_container.style.display = "flex";

    el = document.getElementById("p8_start_button");
    if (el) el.style.display = "flex";
  }
  requestAnimationFrame(p8_update_layout);
}

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
function p8_run_cart() {
  if (p8_is_running) return;
  p8_is_running = true;

  // create audio context and wake it up (for iOS -- needs happen inside touch event)
  p8_create_audio_context();

  // show touch elements
  els = document.getElementsByClassName("p8_controller_area");
  for (i = 0; i < els.length; i++) els[i].style.display = "";

  // install touch events. These also serve to block scrolling / pinching / zooming on phones when p8_is_running
  // moved event.preventDefault(); calls into pico8_buttons_event (want to let top buttons pass through)
  addEventListener(
    "touchstart",
    function(event) {
      pico8_buttons_event(event, 0);
    },
    { passive: false }
  );
  addEventListener(
    "touchmove",
    function(event) {
      pico8_buttons_event(event, 1);
    },
    { passive: false }
  );
  addEventListener(
    "touchend",
    function(event) {
      pico8_buttons_event(event, 2);
    },
    { passive: false }
  );

  // load and run script
  e = document.createElement("script");
  p8_script = e;
  e.onload = function() {
    // show canvas / menu buttons only after loading
    el = document.getElementById("p8_playarea");
    if (el) el.style.display = "table";
  };
  e.type = "application/javascript";
  e.src = "index.js";
  e.id = "e_script";

  document.body.appendChild(e); // load and run

  // hide start button and show canvas / menu buttons. hide start button
  el = document.getElementById("p8_start_button");
  if (el) el.style.display = "none";

  // add #playing for touchscreen devices (allows back button to close)
  if (p8_touch_detected) {
    window.location.hash = "#playing";
    window.onhashchange = function() {
      if (window.location.hash.search("playing") < 0) p8_close_cart();
    };
  }
}

// gamepad  https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
// (sets bits in pico8_buttons[])
function p8_update_gamepads() {
  var threshold = 0.3;
  var max_players = 8;
  var gps = navigator.getGamepads() || navigator.webkitGetGamepads();

  if (!gps) return;

  pico8_gamepads.count = gps.length;

  for (var i = 0; i < gps.length && i < max_players; i++) {
    var gp = gps[i];
    if (gp && gp.axes && gp.buttons) {
      pico8_buttons[i] = 0;

      if (gp.axes[0] && gp.axes[0] < -threshold) pico8_buttons[i] |= 0x1;
      if (gp.axes[0] && gp.axes[0] > threshold) pico8_buttons[i] |= 0x2;
      if (gp.axes[1] && gp.axes[1] < -threshold) pico8_buttons[i] |= 0x4;
      if (gp.axes[1] && gp.axes[1] > threshold) pico8_buttons[i] |= 0x8;

      // buttons: first 4 are O/X; everything else is menu button
      for (j = 0; j < gp.buttons.length; j++)
        if (gp.buttons[j].value > 0 || gp.buttons[j].pressed) {
          if (j < 4) pico8_buttons[i] |= 0x10 << (((j + 1) / 2) & 1);
          // 0 1 1 0 0 1 -- A,X are O,X on xbox controller
          else pico8_buttons[0] |= 0x40; // menu button
        }
    }
  }

  requestAnimationFrame(p8_update_gamepads);
}
requestAnimationFrame(p8_update_gamepads);

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
