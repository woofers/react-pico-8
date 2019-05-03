p8_update_layout();
var canvas = document.getElementById("canvas");
Module = {};
Module.canvas = canvas;
// from @ultrabrite's shell: test if an AudioContext can be created outside of an event callback.
// If it can't be created, then require pressing the start button to run the cartridge
if (p8_autoplay) {
  var temp_context = new AudioContext();
  temp_context.onstatechange = function() {
    if (temp_context.state == "running") {
      p8_run_cart();
      temp_context.close();
    }
  };
}
