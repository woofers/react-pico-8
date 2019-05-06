/** @jsx jsx */
import { jsx, css } from '@emotion/core'
const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const old = importAll(require.context('./images/old', false, /\.(png|jpe?g|svg)$/));

const OldButton = p => {
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
    cursor: pointer;
    cursor: hand;
    text-decoration: none;
    a {
      color: #fff;
    }
    div {
      font-family: verdana;
    }
    &:link,
    &:hover {
      background-color: #aaa;
    }
  `
  const isFunction = () => typeof p.onClick === 'function'
  const onClick = () => {
    if (!isFunction()) return null
    return p.onClick
  }
  const Link = ({ children }) => {
    if (isFunction()) return children
    return (<a css={style} target="_new" href={p.onClick}>{children}</a>)
  }
  return (
    <Link>
      <div css={isFunction() ? style : null} onClick={onClick()}>
        <img width="12px" height="12px" src={old[`${p.button.toLowerCase()}.png`]} alt={p.alt || p.button} />
        {' '}{p.button}
      </div>
    </Link>
 )
}

export default OldButton
