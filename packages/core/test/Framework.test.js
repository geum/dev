const http = require('http')
const fetch = require('node-fetch');
const { Framework, Router, EventEmitter } = require('../src');

test('Framework test', async () => {
  //test variables
  let initialized = false;
  let terminated = false;
  //start the test
  //create the app
  const app = Framework.load();
  //create the server
  const server = http.createServer(app.process.bind(app));

  app.on('initialize', () => {
    initialized = true;
  });

  app.on('shutdown', () => {
    terminated = true;
  });

  //as soon as the server is called and responded, close the server
  app.on('process', (req, res) => {
    res.write('Hello');
    res.end();
    server.close();
  });

  app.run(async () => {
    //listen to server
    server.listen(3000);
  })

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

  expect(await response.text()).toBe('Hello');
  expect(initialized).toBe(true);
  expect(terminated).toBe(true);
});

test('Framework use test', async () => {
  //test variables
  let initialized = false;
  let terminated = false;
  //start the test
  //create the app
  const app = Framework.load();
  const emitter = EventEmitter.load();
  //create the server
  const server = http.createServer(app.process.bind(app));

  emitter.on('initialize', () => {
    initialized = true;
  });

  emitter.on('shutdown', () => {
    terminated = true;
  });

  //as soon as the server is called and responded, close the server
  emitter.on('process', (req, res) => {
    res.write('Hello');
    res.end();
    server.close();
  });

  app.use(emitter);

  app.run(async () => {
    //listen to server
    server.listen(3000);
  })

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

  expect(await response.text()).toBe('Hello');
  expect(initialized).toBe(true);
  expect(terminated).toBe(true);
});

test('Framework request test', async () => {
  const app = Framework.load();

  app.on('/trigger (advance) request/', (req, res) => {
    const x = req.getStage('x');
    res.setResults(x + 1);
  });

  const y = await app.request('trigger advance request', { x: 1 });

  expect(y).toBe(2);

  app.on('/trigger (advance) error/', (req, res) => {
    const x = req.getStage('x');
    res.setError(true, x + 1);
  });

  const z = await app.request('trigger advance error', { x: 1 });

  expect(z).toBe(false);
});

test('Router test', async () => {
  const router = Router.load();

  router.on('request', (req, res) => {
    res.setResults('requested', true);
  })

  router.on('route test', (req, res) => {
    const x = req.getStage('x');
    res.setResults('x', x + 1);
  })

  router.on('route test', (req, res) => {
    const x = req.getStage('x');
    res.setError(true, x + 1);
  })

  router.on('response', (req, res) => {
    res.setResults('responded', true);
  })

  const route = {
    event: 'route test',
    parameters: { x: 1 },
    variables: [1, 2]
  };

  let triggered = false;
  await router.route(route, (req, res) => {
    triggered = true;
    expect(res.getResults('requested')).toBe(true);
    expect(res.getResults('x')).toBe(2);
    expect(res.getResults('responded')).toBe(true);
    expect(res.hasError()).toBe(true);
    expect(res.getMessage()).toBe(2);
  });

  expect(triggered).toBe(true);
});
