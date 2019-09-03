//see: https://tylermcginnis.com/build-your-own-react-router-v4/
//see: https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
//see: Final webpack.config.js and package.json for create-react-app
//see: https://webpack.js.org/concepts/hot-module-replacement/
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');

module.exports = (index, output = null) => {
  let config = Object.assign({}, webpackConfig);
  if (typeof index === 'object') {
    Object.assign(config, index)
  } else if (typeof index === 'string') {
    config.entry.index[1] = index;
  }

  if (typeof output === 'string') {
    config.output.path = output;
  }

  if (config.entry.index[1] === '<CUSTOM>') {
    throw new Error('missing entry.index');
  }

  if (config.output.path === '<CUSTOM>') {
    throw new Error('missing output.path');
  }

  const webpackCompiler = webpack(config);
  const webpackHotCompiler = webpackHot(webpackCompiler)
  const webpackDevCompiler = webpackDev(webpackCompiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  });

  return {
    dev: webpackDevCompiler,
    hot: webpackHotCompiler
  };
};
