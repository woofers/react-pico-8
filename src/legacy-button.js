/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { legacy } from './icons'

const OldButton = p => {
  const isFunction = () => typeof p.onClick === 'function'
  const style = css`
    float: left;
    width: 100%;
    min-height: 16px;
    display: inline-block;
    margin: 1px;
    padding: 4px;
    text-align: center;
    color: #fff;
    background-color: #777;
    font-family: verdana;
    font-size: 9pt;
    cursor: ${p.usePointer || !isFunction() ? 'pointer' : 'auto'};
    cursor: hand;
    text-decoration: none;
    border: 0;
    a {
      color: #fff;
    }
    div {
      font-family: verdana;
    }
    &:hover {
      background-color: #aaa;
    }
  `
  let tag = p.title || p.button
  if (p.on) tag = p.onTitle
  const onClick = () => {
    if (!isFunction()) return null
    return p.onClick
  }
  const Button = ({ children }) => {
    if (!isFunction()) return children
    return (
      <button css={isFunction() ? style : null} onClick={onClick()} aria-label={tag}>
        {children}
      </button>
    )
  }
  const Link = ({ children }) => {
    if (isFunction()) return children
    return (<a role="button" css={style} target="_new" href={p.onClick} aria-label={tag}>{children}</a>)
  }
  return (
    <Link>
      <Button>
        <img width="12px" height="12px" src={legacy[`${p.button.toLowerCase()}.png`]} alt="" />
        {' '}{p.button}
      </Button>
    </Link>
  )
}

export default OldButton
