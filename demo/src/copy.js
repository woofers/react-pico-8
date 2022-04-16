import { css } from '@emotion/react'
import { copyToClipboard } from './utils/clipboard'

const styles = {
  overflow: 'visible',
  width: '0.875em',
  display: 'inline-block',
  fontSize: 'inherit',
  height: '1em',
  verticalAlign: '-0.125em'
}

const Icon = () => (
  <svg style={styles} aria-hidden="false" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path></svg>
)

const icon = css`
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #64605d;
  &:hover {
    color: #ccc;
  }
`

const Copy = p => (
  <button type="button" title="Copy to clipboard" css={icon} onClick={copyToClipboard(p.value)}>
    <Icon />
  </button>
)

Copy.defaultProps = {
  value: 'Copied from button'
}

export default Copy
