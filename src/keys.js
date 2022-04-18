const code = key => key.toUpperCase().charCodeAt(0)

const arrows = [37, 38, 39, 40]

export const keys = [
  code('\r'),
  code('\t'),
  code(' '),
  code('x'),
  code('z'),
  code('m'),
  code('r'),
  code('c'),
  code('v'),
  code('s'),
  code('f'),
  code('e'),
  code('d'),
  code('q'),
  code('w'),
  code('p')
].concat(arrows)

export const blockKeys = e => {
  if (keys.indexOf(e.keyCode) > -1) e.preventDefault()
}
