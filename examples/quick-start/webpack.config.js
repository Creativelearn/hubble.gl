const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const CONFIG = {
  mode: 'development',

  entry: {
    index: './index.js'
  },

  module: {
    rules: [
      {
        // Transpile ES6 to ES5 with babel
        // Remove if your app does not use JSX or you don't need to support old browsers
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        options: {
          plugins: [
            '@babel/plugin-proposal-class-properties',
            [
              '@babel/plugin-transform-runtime',
              {
                absoluteRuntime: false,
                corejs: false,
                helpers: false,
                regenerator: true,
                useESModules: false
              }
            ]
          ],
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  plugins: [
    new HtmlWebpackPlugin({title: 'hubble.gl deck quick-start example'}),
    // Optional: Enables reading mapbox token from environment variable
    new webpack.EnvironmentPlugin(['MapboxAccessToken'])
  ]
};

// This line enables bundling against src in this repo rather than installed module
module.exports = env => (env ? require('../webpack.config.local')(CONFIG)(env) : CONFIG);
