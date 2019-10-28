/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

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
  <CopyToClipboard text={p.value} css={icon}>
    <button type="button" title="Copy to clipboard">
      <Icon aria-hidden={false} icon={faCopy} />
    </button>
  </CopyToClipboard>
)

Copy.defaultProps = {
  value: 'Copied from button'
}

export default Copy
