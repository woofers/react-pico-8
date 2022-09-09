const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')

module.exports = {
  distDir: 'build',
  swcMinify: true,
  reactStrictMode: true,
  images: {
    loader: 'imgix',
    path: 'https://example.com/myaccount/',
  },
  compiler: {
    emotion: true
  },
  webpack(config, { isServer }) {
    config.plugins.push(new ESLintPlugin())
    return config
  },
  basePath: '/react-pico-8',
  assetPrefix: '/react-pico-8/',
  trailingSlash: true
}
