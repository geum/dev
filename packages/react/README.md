## Install

```bash
$ npm i --save @geum/react
```

## Usage

```js
//FILE: app.js
const http = require('http');
const geum = require('@geum/react');

const HomeScreen = require('./HomeScreen.jsx')

const app = geum();

//... make some routes ...

//Hello World
app.get('/', (req, res) => {
  res.setComponent(HomeScreen);
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
