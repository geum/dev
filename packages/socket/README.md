## Install

```bash
$ npm i --save @geum/http
$ npm i --save @geum/socket
```

## Usage

```js
//FILE: app.js
const http = require('http');
const socketio = require('socket.io');

const Http = require('@geum/http');
const Socket = require('@geum/socket');

const controller = require('./controller');
const events = require('./events');

const app = Http();

app.use(controller);

const socket = Socket();

socket.use(events);

const server = http.createServer(app);
socketio(server).use(socket);

//listen to server
server.listen(3000);
```

See the complete example in `test/sames/socketio`
