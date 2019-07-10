import { hasWindow } from './window'

export const addEvent = (name, func, options) => {
  if (!hasWindow()) return
  window.addEventListener(name, func, options)
}

export const removeEvent = (name, func, options) => {
  if (!hasWindow()) return
  window.removeEventListener(name, func, options)
}

export const setEvent = (name, func, options, value) => {
  removeEvent(name, func, options)
  if (value) {
    addEvent(name, func, options)
  }
}
