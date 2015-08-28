var path = require('path');
var webpack = require('webpack');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
var cssimport = require('postcss-import');
var autoprefixer = require('autoprefixer-core');

module.exports = {
devtool: 'cheap-module-eval-source-map',
  // devtool: 'eval-source-map',
  entry: {
    main: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './src/index.js'
    ],
    common: ['react', 'd3', 'leaflet', 'whatwg-fetch', 'react-d3-components', 'redux']
  },
  debug: true,
  output: {
    path: path.join(__dirname, 'dataproduct'),
    filename: 'loader.js',
    chunkFilename: '[name].js',
    publicPath: '/dataproduct/',
    pathinfo: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({ __DEV__: 'true' }),
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
  postcss: function () {
      return [
          cssimport({
              onImport: function (files) {
                  files.forEach(this.addDependency);
              }.bind(this)
          }),
          autoprefixer
      ];
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json-loader', exclude: /node_modules/  },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},
      { test: /App.css$/, exclude: /node_modules/, 
        loaders: ['style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]','postcss-loader']
        // loader: ExtractTextPlugin.extract('style-loader',
        //   'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
      },
    ]
  }
};
