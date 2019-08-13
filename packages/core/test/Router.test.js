const http = require('http');
const fetch = require('node-fetch');
const { Router, EventEmitter } = require('../src');

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

  const route = router.route('route test')

  route.args = [1, 2];
  route.parameters = { x: 1 };

  const res = await route.emit();

  expect(res.getResults('requested')).toBe(true);
  expect(res.getResults('x')).toBe(2);
  expect(res.getResults('responded')).toBe(true);
  expect(res.hasError()).toBe(true);
  expect(res.getMessage()).toBe(2);
});

test('Router request test', async () => {
  const router = Router.load();

  router.on('/trigger (advance) request/', (req, res) => {
    const x = req.getStage('x');

    res.setResults(x + 1);
  });

  const y = await router.request('trigger advance request', { x: 1 });

  expect(y).toBe(2);

  router.on('/trigger (advance) error/', (req, res) => {
    const x = req.getStage('x');
    res.setError(true, x + 1);
  });

  const z = await router.request('trigger advance error', { x: 1 });

  expect(z).toBe(false);
});

test('Router HTTP test', async () => {
  const router = Router.load();

  router.on('POST /some/path', (req, res) => {
    const x = req.getStage('x');

    res.setContent(String(x + 1));
  });

  const server = http.createServer(async (req, res) => {
    const method = req.method.toUpperCase();
    const path = req.url.split('?')[0];
    const route = router.route(method + ' ' + path, { x: 1 });
    const response = await route.emit();

    res.write(response.getContent());
    res.end();
    server.close();
  });

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

  expect(await response.text()).toBe('2');
})
