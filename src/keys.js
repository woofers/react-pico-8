const enter = 13
const x = 88
const alt_x = 77
const z = 90
const alt_z = 82
const tab = 9
const space = 32
const arrows = [37, 38, 39, 40]

export const keys = [enter, x, alt_x, z, alt_z, tab, space].concat(arrows)

export const blockKeys = (e) => {
  if (keys.indexOf(e.keyCode) > -1) e.preventDefault()
}
