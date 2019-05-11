/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import PrismCode from 'react-prism'
import 'prismjs'
import 'prismjs/components/prism-jsx.min'
import 'prism-themes/themes/prism-dracula.css'

const code = css`
  width: 600px;
  pre {
    padding: 0;
    padding-bottom: 25px;
    background: #191919;
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
`

const CodeBlock = p => {
  let lang = p.language || ''
  lang = lang.toLowerCase()
  return (
    <div css={code}>
      <PrismCode component="pre" className={`language-${lang}`}>
        {p.children}
      </PrismCode>
    </div>
  )
}

export default CodeBlock
