import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import image from 'rollup-plugin-image'
import copy from 'rollup-plugin-copy'
const json = require('./package.json')
const dependencies = [
  ...Object.keys(json.dependencies),
  ...Object.keys(json.peerDependencies)
]

const config = {
  plugins: [
    image(),
    babel({
      exclude: "node_modules/**"
    }),
    copy({
      targets: ['src/images'],
      outputFolder: 'dist'
    }),
    uglify()
  ],
  input: json.src,
  external: dependencies,
  output: {
    format: 'cjs',
    file: json.main,
    name: json.name
  }
}
export default config
