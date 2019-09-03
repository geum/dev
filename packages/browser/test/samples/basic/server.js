const http = require('http');
const geum = require('@geum/http');

//see: https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
const webpack = require('webpack');
const webpackCfg = require('./webpack.config');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
const webpackCmp = webpack(webpackCfg);

const app = geum();

app.use(webpackDev(webpackCmp, {
  noInfo: true,
  publicPath: webpackCfg.output.publicPath
}));

app.use(webpackHot(webpackCmp));

//make client public
app.public(__dirname + '/client');

//track errors
app.on('error', (e, req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setContent(e.message);
});

//default
const server = http.createServer(app);

//listen to server
server.listen(3000);

//custom routes
const fs = require('fs');
const template = fs.readFileSync(__dirname + '/client/index.html', 'utf8');

const router = require('./client/router');
app.use(router);

app.get('/some/path', function(req, res) {
  res.content = template.replace(
    '<div id="root"></div>',
    '<div id="root">' + res.content + '</div>'
  );
});

app.get('/some/other/path', function(req, res) {
  res.setContent(template.replace(
    '<div id="root"></div>',
    '<div id="root">' + res.getContent() + '</div>'
  ));
});
