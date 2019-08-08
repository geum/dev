const http = require('http');
const fetch = require('node-fetch');
const { Application, Router } = require('../src');

test('server test', async() => {
  const app = Application.load();

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
  const server = http.createServer(app.process);

  //initialze the app
  app.initialize();

  //listen to server
  server.listen(3000);

  //wait for close
  server.on('close', () => {
    //and properly shutdown the app
    app.shutdown();
  });

  //as soon as the server is called and responded, close the server
  app.on('process', () => { server.close() }, -100);

  const response = await fetch('http://127.0.0.1:3000/some/path?lets=dothis', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      //'Content-Type': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: 'foo=bar&zoo[]=1&zoo[]=2&zoo[]=3', // body data type must match "Content-Type" header
  });

  expect(await response.text()).toBe('Hello :name from /some/path');
});

test('router test', async() => {
  const app = Application.load();
  const router1 = Router.load();
  const router2 = Router.load();

  //make some routes
  router1.route('/some/path').post((req, res) => {
    res.content.set('Hello from /some/path');
  });

  router2.post('/some/path', (req, res) => {
    res.content.set('Hello again from /some/path');
  });

  router2.post('/:category/:name', (req, res) => {
    res.rest.setError(true, 'Something went wrong');
    res.content.set('Hello :name from /some/path');
  });

  app.use(router1, router2);

  ///default
  const server = http.createServer(app.process);

  //initialze the app
  app.initialize();

  //listen to server
  server.listen(3000);

  //handle errors
  app.on('error', (e, req, res) => {
    throw e;
  });

  //wait for close
  server.on('close', () => {
    //and properly shutdown the app
    app.shutdown();
  });

  //as soon as the server is called and responded, close the server
  app.on('process', () => { server.close() }, -100);

  const response = await fetch('http://127.0.0.1:3000/some/path?lets=dothis', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      //'Content-Type': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: 'foo=bar&zoo[]=1&zoo[]=2&zoo[]=3', // body data type must match "Content-Type" header
  });

  expect(await response.text()).toBe('Hello :name from /some/path');
});