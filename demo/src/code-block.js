import { css } from '@emotion/react'
import PrismCode from 'react-prism'
import 'prismjs'
import 'prismjs/components/prism-jsx.min'
import Copy from './copy'

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
      span[class*="class-name"] {
        color: #ff79c6;
      }
    }
    span, code, pre {
      font-family: 'Inconsolata', monospace;
    }
    span[class*="boolean"],
    span[class*="string"],
    span[class*="attr-value"] {
      font-weight: 700;
    }
  }
`

const copy = css`
  position: absolute;
  right: 10px;
  top: 10px;
`

const CodeBlock = p => {
  let lang = p.language || ''
  lang = lang.toLowerCase()
  return (
    <div css={code}>
      <span css={copy}><Copy value={p.children} /></span>
      <div>
        <PrismCode component="pre" className={`language-${lang}`}>
          {p.children}
        </PrismCode>
      </div>
    </div>
  )
}

export default CodeBlock
