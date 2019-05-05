import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import copy from 'rollup-plugin-copy'
import { string } from "rollup-plugin-string"
const json = require('./package.json')
const dependencies = [
  ...Object.keys(json.dependencies),
  ...Object.keys(json.peerDependencies)
]

const config = {
  plugins: [
    string({
      include: "**/*.js",
      exclude: ["src/pico-8.js"]
    }),
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
