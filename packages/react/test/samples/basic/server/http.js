const { createServer } = require('http');
const http = require('@geum/http');

const server = http();

//make client public
server.public(__dirname + '/../client');

//track errors
server.on('error', (e, req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setContent(e.message);
});

//listen to server
createServer(server).listen(3000);

module.exports = server;
