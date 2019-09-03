const path = require('path');
const http = require('http');

const geum = require('@geum/http');
const app = geum();

const webpack = require('@geum/webpack');

const { dev, hot } = webpack(
  './client/index.js',
  path.join(__dirname, 'client/')
);

app.use(dev, hot);

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
