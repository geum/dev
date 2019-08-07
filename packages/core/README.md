### Usage

```js
const http = require('http');
const { HttpServer } = require('@geum/core');

const app = HttpServer.load();

//make some routes
app.route('/some/path').post((req, res) => {
  res.content.set('Hello from /some/path');
});

app.post('/some/path', (req, res) => {
  res.content.set('Hello again from /some/path');
});

app.post('/:category/:name', (req, res) => {
  res.rest.setError(true, 'Something went wrong');
  res.content.set('Hello :name from /some/path');
});

///default
//const server = http.createServer(app.process);
const server = http.createServer(app.process);

//initialze the app
app.initialize();

//listen to server
server.listen(3000);
```
