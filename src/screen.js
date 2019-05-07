
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
