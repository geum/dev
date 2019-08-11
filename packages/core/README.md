## Install

```bash
$ npm i --save @geum/core
```

## EventEmitter Usage

```js
const { EventEmitter, Helper } = require('@geum/core')

const emitter = EventEmitter.load()

emitter.on('trigger something', async x => {
  console.log('something triggered', x + 1)
})

emitter.on(/trigger (something)/, async x => {
  await Helper.sleep(2000)
  console.log('(something) triggered', x + 2)
}, 2)

await emitter.trigger('trigger something', 1)
```

## TaskQueue Usage

```js
const { TaskQueue, Helper } = require('@geum/core')

const queue = TaskQueue.load()

queue.push(async x => {
  console.log(x + 1)
})

queue.shift(async x => {
  await Helper.sleep(2000)
  console.log(x + 2)
})

queue.add(async x => {
  console.log(x + 3)
}, 10)

await queue.run(1)
```

## Registry Usage

```js
const { Registry } = require('@geum/core')

const registry = Registry.load()

registry.set('foo', 'bar', 'zoo')
registry.set('foo', 'zoo', ['foo', 'bar', 'zoo'])

console.log(registry.has('foo', 'bar'))
console.log(registry.has('bar', 'foo'))
console.log(registry.get('foo', 'zoo', 1))

registry.remove('foo', 'bar')

console.log(registry.has('foo', 'bar'))
console.log(registry.has('foo', 'zoo'))
```

## Router Usage

```js
const { Router } = require('@geum/core')

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

await router.route(route, (req, res) => {
  console.log(res.getResults());
});
```

## Framework Usage

```js

const http = require('http')
const { Framework } = require('@geum/core')

const app = Framework.load()

app.on('initialize', async() => {
  console.log('I am initializing')
})

app.on('process', async(req, res) => {
  console.log('i am processing')
})

app.run(async() => {
  //create the server
  const server = http.createServer(app.process.bind(app))

  //do something
  //...

  //listen to server
  server.listen(3000)
})

```
