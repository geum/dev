const http = require('http');
const socketio = require('socket.io');

const { Application, Socket } = require('../../../src');

const controller = require('./controller');
const events = require('./events');

const app = Application.load();

app.use(controller);

const socket = Socket.load();

socket.use(events);

app.run(() => {
  const server = http.createServer(app.process);
  socketio(server).use(socket.process);

  //listen to server
  server.listen(3000);
});
