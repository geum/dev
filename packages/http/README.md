## Install

```bash
$ npm i --save @geum/http
```

## Usage

```js
//FILE: app.js
const http = require('http');
const geum = require('@geum/http');

const app = geum();

//... make some routes ...

//Hello World
app.get('/', (req, res) => {
  res.setContent('Hello World');
});

//... listen to app events ...

//track errors
app.on('error', (e, req, res) => {
  app.log(e);
  res.setHeader('Content-Type', 'text/plain');
  res.setContent(e.toString());
});

//... run it ...

//default
const server = http.createServer(app);

//listen to server
server.listen(3000);
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

//...
// FILE: app.js

const http = require('http');
const geum = require('@geum/http');
const controller = require('./controller')

const app = geum();

//... add controllers ...

app.use(controller);

//... run it ...

//default
const server = http.createServer(app);

//listen to server
server.listen(3000);
```
