import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
const json = require('./package.json')
const dependencies = [
  ...Object.keys(json.dependencies),
  ...Object.keys(json.peerDependencies)
]

const config = {
  plugins: [
    postcss({
      plugins: []
    }),
    babel({
      exclude: "node_modules/**"
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
