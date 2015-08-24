// setup webpack-dev-server
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config');

var devServer = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  quiet: false,
  historyApiFallback: true
});

devServer.listen(8080, '0.0.0.0', function (err) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at 127.0.0.1:8080 ');
});


