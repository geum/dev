const path = require('path');
const http = require('http');
const geum = require('@geum/http');
const webpack = require('../../src');

const { dev, hot } = webpack(
  path.join(__dirname, 'public/index.js'),
  path.join(__dirname, 'public/')
);

const app = geum();

//add webpack
app.use(dev, hot);

//make client public
app.public(__dirname + '/public');

//default
const server = http.createServer(app);

//listen to server
server.listen(3000);
