//see: https://tylermcginnis.com/build-your-own-react-router-v4/
//see: https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
//see: Final webpack.config.js and package.json for create-react-app
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
const webpackCompiler = webpack(webpackConfig);
const webpackHotCompiler = webpackHot(webpackCompiler)
const webpackDevCompiler = webpackDev(webpackCompiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
});

module.exports = {
  dev: webpackDevCompiler,
  hot: webpackHotCompiler
};
