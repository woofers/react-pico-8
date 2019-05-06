import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import copy from 'rollup-plugin-copy'
const json = require('./package.json')
const dependencies = [
  ...Object.keys(json.dependencies),
  ...Object.keys(json.peerDependencies)
]

const config = {
  plugins: [
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
