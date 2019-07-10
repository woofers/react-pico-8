export const addEvent = (name, func, options) => {
  window.addEventListener(name, func, options)
}

export const removeEvent = (name, func, options) => {
  window.removeEventListener(name, func, options)
}

export const setEvent = (name, func, options, value) => {
  removeEvent(name, func, options)
  if (value) {
    addEvent(name, func, options)
  }
}
