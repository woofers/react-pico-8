/** @jsx jsx */
import { jsx } from '@emotion/core'
import LegacyButton from './legacy-button'
import Button from './button'

const SmartButton = p => {
  return ( p.legacyButtons ? <LegacyButton {...p} /> : <Button {...p} /> )
}

export const Reset = p => {
  return (<SmartButton {...p} button="Reset" title="Reset" onClick={p.reset} />)
}

export const Pause = p => {
  return (<SmartButton button="Pause" onTitle="Play" title="Pause" {...p} onClick={p.pause} on={p.isPaused} />)
}

export const Fullscreen = p => {
  return (<SmartButton button="Fullscreen" title="Go Fullscreen" {...p} onClick={p.fullscreen} />)
}

export const Sound = p => {
  return (<SmartButton button="Sound" onTitle="Mute" title="Unmute" {...p} onClick={p.sound} on={!p.isMuted} />)
}

export const Carts = p => {
  return (<SmartButton {...p} button="Carts" title="More Carts" onClick="http://www.lexaloffle.com/bbs/?cat=7&sub=2" />)
}

export const Controls = p => {
  return (<SmartButton button="Controls" title="Controls" {...p} onClick={p.controls} />)
}
