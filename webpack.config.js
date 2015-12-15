var path = require('path');
var webpack = require('webpack');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');
var cssimport = require('postcss-import');
var autoprefixer = require('autoprefixer-core');

module.exports = {
  devtool: 'source-map',
  entry: {
    main: [
      './src/index.js'
    ],
    common: ['react', 'd3', 'leaflet', 'whatwg-fetch', 'redux']
  },
  output: {
    path: path.join(__dirname, 'dataproduct'),
    filename: 'loader.js',
    chunkFilename: '[name].js',
    publicPath: '/dataproduct/',
    pathinfo: true
  },
  plugins: [
    new webpack.DefinePlugin({ __DEV__: 'false' }),
    // new ExtractTextPlugin('style.css', { allChunks: true }),
    new webpack.optimize.CommonsChunkPlugin('common', 'common.bundle.js')
  ],
  resolve: {
    extensions: ['', '.js'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
      context$: '../dev_context'
    }
  },
  postcss: [
    require('autoprefixer-core'),
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /App.css$/, exclude: /node_modules/, 
        loaders: ['style-loader',
          'css-loader?modules&importLoaders=1!postcss-loader']
      // { test: /\.css$/, exclude: /node_modules/, 
      //   loader: ExtractTextPlugin.extract('style-loader',
      //     'css-loader?modules&importLoaders=1!postcss-loader')
      },
    ]
  }
};
