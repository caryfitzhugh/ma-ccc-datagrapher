var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    main: [
      './src/index.js'
    ],
    common: ['react', 'd3', 'leaflet', 'whatwg-fetch', 'react-d3-components', 'redux']
  },
  output: {
    path: path.join(__dirname, 'dataproduct'),
    filename: 'loader.js',
    chunkFilename: '[name].js',
    publicPath: '/dataproduct/'
  },
  plugins: [
    new ExtractTextPlugin('style.css', { allChunks: true }),
    new webpack.optimize.CommonsChunkPlugin('common', 'common.bundle.js')
  ],
  resolve: {
    extensions: ['', '.js'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
      'redux-devtools': path.join(__dirname,'node_modules','redux-devtools','lib'),
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
      { test: /\.css$/, exclude: /node_modules/, 
        loader: ExtractTextPlugin.extract('style-loader',
          'css-loader?modules&importLoaders=1!postcss-loader')
      },
    ]
  }
};
