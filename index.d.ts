import React from 'react'

type Nothing = Record<never, never>

type ReactPico8Props = {
  autoPlay?: boolean
  leagcyButtons?: boolean
  hideCursor?: boolean
  center?: boolean
  blockKeys?: boolean
  usePointer?: boolean
  unpauseOnReset?: boolean
  placeholder?: string
  src: string
  className?: string
}

declare const Pico8: React.FC<ReactPico8Props>

export default Pico8