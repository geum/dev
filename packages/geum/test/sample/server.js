const http = require('http');
const { app } = require('geum');

//see: https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
const webpack = require('webpack');
const webpackCfg = require('./webpack.config');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
const webpackCmp = webpack(webpackCfg);

app.server.use(webpackDev(webpackCmp, {
  noInfo: true,
  publicPath: webpackCfg.output.publicPath
}));

app.server.use(webpackHot(webpackCmp));

//make client public
app.server.public(__dirname + '/client');

//track errors
app.server.on('error', (e, req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setContent(e.message);
});

//listen to server
http.createServer(app.server).listen(3000);
