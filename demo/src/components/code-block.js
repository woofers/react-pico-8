import { css } from '@emotion/react'
import PrismCode from 'react-prism'
import 'prismjs'
import 'prismjs/components/prism-jsx.min'
import Copy from 'components/copy'

const code = css`
  && {
    position: relative;
    width: 600px;
    div {
      background: #191919;
      border-radius: 0.3em;
    }
    pre {
      background: none;
      margin-left: 20px;
      padding: 0;
      padding-bottom: 25px;
      span[class*='class-name'] {
        color: #ff79c6;
      }
    }
    span,
    code,
    pre {
      font-family: 'Inconsolata', monospace;
    }
    span[class*='boolean'],
    span[class*='string'],
    span[class*='attr-value'] {
      font-weight: 700;
    }
  }
`

const copy = css`
  position: absolute;
  right: 10px;
  top: 10px;
`

const CodeBlock = ({ language, children, ...rest }) => {
  const lower = language || ''
  const lang = lower.toLowerCase()
  return (
    <div css={code} {...rest}>
      <span css={copy}>
        <Copy value={children} />
      </span>
      <div>
        <PrismCode component="pre" className={`language-${lang}`}>
          {children}
        </PrismCode>
      </div>
    </div>
  )
}

export default CodeBlock
