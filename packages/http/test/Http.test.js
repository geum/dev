const fs = require('fs');
const http = require('http');
const fetch = require('node-fetch');
const geum = require('../src');

test('server test', async() => {
  const app = geum();

  //make some routes
  app.route('/some/path').post((req, res) => {
    res.setContent('Hello from /some/path');
  });

  app.post(['/some/path', '/some/path/2'], (req, res) => {
    res.setContent('Hello again from /some/path');
  });

  app.post('/:category/:name', (req, res) => {
    res.setError(true, 'Something went wrong');
    res.setContent('Hello :name from /some/path');
  });

  //default
  const server = http.createServer(app);

  //as soon as the server is called and responded, close the server
  app.on('close', () => { server.close() });

  //listen to server
  server.listen(3000);

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
  const app = geum();
  const router1 = geum.Router.load();
  const router2 = geum.Router.load();

  //make some routes
  router1.route('/some/path').post((req, res) => {
    res.setContent('Hello from /some/path');
  });

  router2.post('/some/path', (req, res) => {
    res.setContent('Hello again from /some/path');
  });

  router2.post('/:category/:name', (req, res) => {
    res.setError(true, 'Something went wrong');
    res.setContent('Hello :name from /some/path');
  });

  app.use(router1, router2);

  //default
  const server = http.createServer(app);

  //as soon as the server is called and responded, close the server
  app.on('close', () => { server.close() });

  //listen to server
  server.listen(3000);

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
    body: 'foo=bar&zoo[]=1&zoo[]=2&zoo[]=3&product[title]=test'
      + '&product[price]=1000&product[rating][]=1&product[rating][]=2'
      + '&product[rating][]=3&product[abstract][][name]=john'
      + '&product[abstract][][name]=james&boom[]=1',
    // body data type must match "Content-Type" header
  });

  expect(await response.text()).toBe('Hello :name from /some/path');
});

test('re-routing test', async() => {
  const app = geum();
  const router = geum.Router.load();

  //make some routes
  router.route('/some/path').get(async(req, res) => {
    req.setStage('x', 1);
    await router.routeTo('get', '/some/other/path', req, res);
    res.setContent(req.getStage('x'));
  });

  router.get('/some/other/path', (req, res) => {
    req.setStage('x', 2);
  });

  app.use(router);

  //default
  const server = http.createServer(app);

  //as soon as the server is called and responded, close the server
  app.on('close', () => { server.close() });

  //listen to server
  server.listen(3000);

  const response = await fetch('http://127.0.0.1:3000/some/path?lets=dothis');

  expect(await response.text()).toBe('2');
});

test('static file test', async() => {
  const app = geum();

  //make some routes
  app.route('/note.txt').get(async(req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setContent(fs.createReadStream(__dirname + '/note.txt'));
  });

  //default
  const server = http.createServer(app);

  //as soon as the server is called and responded, close the server
  app.on('close', () => { server.close() });

  //listen to server
  server.listen(3000);

  const response = await fetch('http://127.0.0.1:3000/note.txt');
  const text = await response.text();
  expect(text.trim()).toBe('This is a note.');
});

test('path test', async() => {
  const app = geum();

  //make some routes
  app.route('/components/**').get(async(req, res) => {
    expect(req.get('path', 'array').length).toBe(4)
    res.setHeader('Content-Type', 'text/plain');
    res.setContent('in');
  });

  //default
  const server = http.createServer(app);

  //as soon as the server is called and responded, close the server
  app.on('close', () => { server.close() });

  //listen to server
  server.listen(3000);

  const response = await fetch('http://127.0.0.1:3000/components/some/path.txt');
  const text = await response.text();
  expect(text.trim()).toBe('in');
});
