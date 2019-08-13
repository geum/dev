const http = require('http');
const socketio = require('socket.io');

const geum_http = require('@geum/http');
const geum_socket = require('../../../src');

const controller = require('./controller');
const events = require('./events');

const app = geum_http();

app.use(controller);

const socket = geum_socket();

socket.use(events);

const server = http.createServer(app);
socketio(server).use(socket);

//listen to server
server.listen(3000);
