React PICO-8
===========
[![img](https://wdp9fww0r9.execute-api.us-west-2.amazonaws.com/production/badge/woofers/react-pico-8)](https://wdp9fww0r9.execute-api.us-west-2.amazonaws.com/production/results/woofers/react-pico-8) [![img](https://david-dm.org/woofers/react-pico-8.svg)](https://www.npmjs.com/package/react-pico-8) [![img](https://badge.fury.io/js/react-pico-8.svg)](https://www.npmjs.com/package/react-pico-8) [![img](https://img.shields.io/npm/dt/react-pico-8.svg)](https://www.npmjs.com/package/react-pico-8) [![img](https://img.shields.io/npm/l/react-pico-8.svg)](https://github.com/woofers/react-pico-8/blob/master/License.txt) [![img](https://img.shields.io/badge/greenkeeper-enabled-brightgreen.svg)](https://greenkeeper.io/)

Run [PICO-8](https://lexaloffle.com/pico-8.php) game cartridges using a cusomtizable React component.

**[Live Demo](https://jaxson.vandoorn.ca/react-pico-8/)**

**Note:** This project is community made and not endorsed by Lexaloffle or the offical [PICO-8](https://www.lexaloffle.com/pico-8.php) Fantasy Console.


# Installation

**Yarn**

    yarn add react-pico-8

**npm**

    npm install react-pico-8


# Usage

```jsx
import React from 'react'
import Pico8 from 'react-pico-8'
import { Controls,
         Reset,
         Pause,
         Sound,
         Carts,
         Fullscreen } from 'react-pico-8/buttons'

const App = () => (
  <Pico8 src="index.js"
         autoPlay={true}
         legacyButtons={false}
         hideCursor={false}
         center={true}
         blockKeys={false}
         usePointer={true}
         unpauseOnReset={true}
         placeholder="placeholder.png"
  >
    <Controls/>
    <Reset/>
    <Pause/>
    <Sound/>
    <Carts/>
    <Fullscreen/>
  </Pico8>
)
```

Simply add the game widget to the React application using JSX.

Be sure to include the `.js` `src` of the game cartridge generated from [PICO-8](https://lexaloffle.com/pico-8.php)'s web export.

If no buttons are nested in the component then the default [PICO-8](https://lexaloffle.com/pico-8.php) buttons will be used.


## Props


### Src

Source of the game cartridge.  **Required**

This can be obtained from [PICO-8](https://lexaloffle.com/pico-8.php) by loading a game cart, then typing the command `export index.html`.

[PICO-8](https://lexaloffle.com/pico-8.php) produces two files: the cartridge `index.js` and the player `index.html`.

Since `react-pico-8` already has the game player embeded, only the `.js` file needs to be provided as the `src`.


### Auto Play

`autoPlay` indicates if the game canvas should attempt to auto-play on page-load. **Default:** `true`


### Legacy Buttons

`legacyButtons` is used to select the type of buttons. **Default:** `false`


### Hide Cursor

`hideCusor` indicates if the cursor is hidden over the game canvas when the game is playing.  **Default:** `false`


### Center

`center` indicates if the game is centred outside of fullscreen mode. **Default:** `true`


### Block Keys

If `blockKeys` is set keys which are used to interact with the game are blocked from scrolling when the game is running.

If un-set keys will only be blocked when the canvas is focused.  **Default:** `false`


### Use Pointer

If `usePointer` is set the pointer hand will be used on buttons.

If un-set a normal cursor will be used on all buttons which do not lead to a new page. **Default:** `true`


### Unpause On Reset

If `unpauseOnReset` is set hitting the reset button when paused will instantly reset the game.

If un-set the game will need to be resumed before it resets. **Default:** `true`


### Placeholder

The image to be used as a placeholder prior to starting the game.  If un-set, a black background will be used.  **Default:** `''`
