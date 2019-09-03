const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const { app } = require('geum');

//set the current path
app.set('pwd', process.env.PWD);

app.set('paths', {
  root: process.env.PWD,
  config: path.join(app.pwd, 'config'),
  module: path.join(app.pwd, 'module'),
  public: path.join(app.pwd, 'public'),
  vendor: path.join(app.pwd, 'node_modules')
});

app.set('store', {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'cradle_sandbox'
  }
});

//on error
app.on('error', e => {
  console.log(e);
});

//load up all the modules and packages
app.initialize();

//run it
const server = http.createServer(app.server);
socketio(server).use(app.socket);
server.listen(3000);
