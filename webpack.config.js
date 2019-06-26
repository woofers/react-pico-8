const path = require('path')
const nodeExternals = require('webpack-node-externals')
const json = require('./package.json')
const getPath = path => path.substring(0, path.lastIndexOf('/'))
const getFile = path => path.substring(path.lastIndexOf('/') + 1)
const mode = process.env.NODE_ENV

module.exports = {
  entry: `./${json.src}`,
  output: {
    filename: getFile(json.main),
    path: path.resolve(__dirname, getPath(json.main)),
    library: '',
    libraryTarget: 'commonjs'
  },
  externals: [nodeExternals()],
  mode: 'production',
  optimization: {
    minimize: mode === 'production'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.png$/,
        loader: "url-loader?mimetype=image/png"
      }
    ]
  }
}
