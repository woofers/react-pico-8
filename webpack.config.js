const path = require('path')
const nodeExternals = require('webpack-node-externals')
const json = require('./package.json')
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const getPath = path => path.substring(0, path.lastIndexOf('/'))
const getFile = path => path.substring(path.lastIndexOf('/') + 1)
const mode = process.env.NODE_ENV

module.exports = {
  plugins: [
    new ESLintPlugin({
      failOnWarning: true,
      failOnError: true
    })
  ],
  entry: {
    'react-pico-8': `./${json.src}`,
    buttons: './src/external-buttons.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname),
    library: json.name,
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: [nodeExternals(), 'react'],
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.png$/,
        use: [{ loader: 'url-loader?mimetype=image/png' }]
      }
    ]
  },
  optimization: {
    minimize: true,
    chunkIds: 'natural',
    moduleIds: 'natural'
  }
}
