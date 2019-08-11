## Install

```bash
$ npm i --save @geum/http
```

## Usage

```js
//FILE: app.js
const http = require('http');
const { Application } = require('@geum/http');

const app = Application.load();

//... make some routes ...

//Hello World
app.get('/', (req, res) => {
  res.setContent('Hello World');
});

//Stage Test
app.get('/rest/:category/search', (req, res) => {
  res.setError(false);
  res.setResults({ category: req.getStage('category') });
});

//... listen to app events ...

//track errors
app.on('error', (e, req, res) => {
  app.log(e);
  res.setHeader('Content-Type', 'text/plain');
  res.setContent(e.toString());
});

//track logs
app.on('log', (...args) => {
  console.log(...args);
});

//... run it ...

app.run(() => {
  //default
  const server = http.createServer(app.process);

  //listen to server
  server.listen(3000);
});
```

### Defining Routes in a separate file

```js
// FILE: controller.js
const { Router } = require('@geum/http');

const router = module.exports = Router.load();

//Hello World
router.get('/', (req, res) => {
  res.setContent('Hello World');
});

//Stage Test
router.get('/rest/:category/search', (req, res) => {
  res.setError(false);
  res.setResults({ category: req.getStage('category') });
});

//...
// FILE: app.js

const http = require('http');
const { Application } = require('@geum/http');
const controller = require('./controller')

const app = Application.load();

//... add controllers ...

app.use(controller);

//... run it ...

app.run(() => {
  //default
  const server = http.createServer(app.process);

  //listen to server
  server.listen(3000);
});
```

### Using Socket.io

```js
//FILE: app.js
const http = require('http');
const socketio = require('socket.io');

const { Application, Socket } = require('@geum/http');

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
```

See more in `test/samples`

### Using Syncronous Middlewares

```js
//FILE: app.js
const http = require('http');
const { Application } = require('@geum/http');

const app = Application.load();

//... middleware ...
const cookie = require('cookie-parser')();
const session = require('express-session')({
  secret: 'keyboard cat',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
});

//use cookie
app.use((req, res) => {
  //transform to async function
  return new Promise(resolve => {
    cookie(req, res, resolve)
  });
});

//use session
app.use((req, res) => {
  //transform to async function
  return new Promise(resolve => {
    session(req, res, resolve)
  });
});

//... make some routes ...

app.route('/cookie').get((req, res) => {
  const views = (req.getCookie('views') || 0) + 1;
  res.setContent(`Viewed ${views} times`);
  res.setCookie('views', views);
});

app.route('/session').get((req, res) => {
  const views = (req.getSession('views') || 0) + 1;
  res.setContent(`Viewed ${views} times`);
  res.setSession('views', views);
});

app.on('request', (req, res) => {
  //load the session
  const incomingMessage = req.IncomingMessage;
  const session = Object.assign({}, incomingMessage.session);
  delete session.cookie;
  req.setSession(session);
  res.setSession(session);
});

app.on('response', (req, res) => {
  //unload the session
  const session = req.getSession();
  const incomingMessage = req.IncomingMessage;
  Object.keys(session).forEach(name => {
    incomingMessage.session[name] = session[name];
  });
});

//... run it ...

app.run(() => {
  //default
  const server = http.createServer(app.process);

  //listen to server
  server.listen(3000);
});
```
