import { addEvent } from './event'

export const goFullscreen = (area) => {
  if (area.requestFullscreen) {
    area.requestFullscreen()
  }
  else if (area.mozRequestFullScreen) {
    area.mozRequestFullScreen()
  }
  else if (area.webkitRequestFullScreen) {
    area.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
  }
  else if (area.msRequestFullScreen) {
    area.msRequestFullScreen()
  }
}

export const onFullscreenExit = (callback) => {
  const events = [
    document.webkitIsFullScreen,
    document.mozFullScreen,
    document.msFullscreenElement,
    document.fullscreenElement
  ]
  for (const event of events) {
    if (event === false) {
      callback()
      return
    }
  }
}

export const onFullscreenEvent = (func, options) => {
  addEvent('webkitfullscreenchange', func, options);
  addEvent('mozfullscreenchange', func, options);
  addEvent('fullscreenchange', func, options);
  addEvent('MSFullscreenChange', func, options);
}

export const removeOnFullscreenEvent = (func, options) => {
  removeEvent('webkitfullscreenchange', func, options);
  removeEvent('mozfullscreenchange', func, options);
  removeEvent('fullscreenchange', func, options);
  removeEvent('MSFullscreenChange', func, options);
}
