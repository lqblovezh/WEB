const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const pkg = require('./package.json')

function resolve (dir) {
 return path.resolve(__dirname, dir)
}

const dev = process.env.NODE_ENV !== 'production'

const gitRevisionPlugin = new GitRevisionPlugin({
  lightweightTags: true,
})

const defineValues = new webpack.DefinePlugin({
  __DEV__: dev,
  __VERSION__: JSON.stringify(pkg.version),
})

const extractCSS = new ExtractTextPlugin(`${pkg.name}.[name].css`)

module.exports = {
  entry: {
    'desktop': './src/desktop.es',
    'mobile': './src/mobile.es',
  },
  output: {
    path: resolve('out'),
    filename: `${pkg.name}.[name].js`,
    library: 'Reader3',
    libraryTarget: 'window',
  },
  devtool: dev ? 'source-map' : 'none',
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.(es|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [['env', {
              targets: {
                browsers: ['ie 9']
              }
            }], 'stage-0', 'react'],
            plugins: [['transform-runtime', {
              polyfill: false,
            }], 'transform-decorators-legacy'],
          }
        }
      }, {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: extractCSS.extract([
          // 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              minimize: true,
              localIdentName: `${pkg.name}__[folder]__[local]`,
            }
          },
          'postcss-loader',
        ])
      }, {
        test: /\.(jpg|jpeg|png|gif|svg)$/i,
        use: 'url-loader',
      }
    ]
  },
  plugins: dev ? [
    extractCSS,
    defineValues,
  ] : [
    extractCSS,
    defineValues,
    gitRevisionPlugin,
    new MinifyPlugin({
      booleans: false,
      infinity: false,
      removeConsole: true,
      removeDebugger: true,
      replace: {
        replacements: [{
          identifierName: "__DEV__",
          replacement: {
            type: "booleanLiteral",
            value: 0,
          }
        }]
      }
    }),
  ],
  resolve: {
    extensions: ['.es', '.jsx', '.js', '.json'],
    alias: {
      '~': resolve('src'),
      'delay': resolve('src/utils/delay.js'),
   },
  },
  devServer: {
    port: 3201,
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: true,
    inline: false,
    historyApiFallback: false,
    contentBase: './out',
  },
}
