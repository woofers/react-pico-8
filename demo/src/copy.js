/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { copyToClipboard } from './utils/clipboard'

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
    <Icon aria-hidden={false} icon={faCopy} />
  </button>
)

Copy.defaultProps = {
  value: 'Copied from button'
}

export default Copy
