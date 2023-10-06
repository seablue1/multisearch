'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');
const path = require('path')

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    contentScript: PATHS.src + '/contentScript.js',
    background: PATHS.src + '/background.js',
  },
  devServer: {
    hot: false,
    liveReload: false,
    devMiddleware: {
      writeToDisk: true,
    }
  },
});

module.exports = config;
