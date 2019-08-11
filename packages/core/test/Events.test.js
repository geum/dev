const { EventEmitter } = require('../src');

test('event on', async () => {
  const emitter = EventEmitter.load();

  expect(emitter).toBeInstanceOf(EventEmitter);

  const actual = emitter.on('on something', x => {});

  expect(actual).toBeInstanceOf(EventEmitter);
});

test('event matching', async () => {
  const emitter = EventEmitter.load();

  emitter.on('match something', x => {});
  emitter.on('/match (something)/i', x => {});
  emitter.on('/match (some)(thing)/i', x => {});

  const matches = emitter.match('match something');

  expect(matches['match something'].pattern).toBe('match something');
  expect(matches['/match (something)/i'].pattern).toBe('/match (something)/i');
  expect(matches['/match (some)(thing)/i'].pattern).toBe('/match (some)(thing)/i');

  expect(matches['/match (something)/i'].variables.length).toBe(1);
  expect(matches['/match (some)(thing)/i'].variables.length).toBe(2);
});

test('trigger basic event', async () => {
  let emitter = EventEmitter.load();

  let triggered = [];
  emitter.on('trigger basic something', async x => {
    expect(x).toBe(1);
    triggered.push(1);
  }, 1);

  emitter.on('trigger basic something', async x => {
    expect(x).toBe(1);
    triggered.push(2);
  }, 2);

  await emitter.emit('trigger basic something', 1);

  expect(triggered.length).toBe(2);
  expect(triggered[0]).toBe(2);
  expect(triggered[1]).toBe(1);
});

test('trigger advance event', async () => {
  let emitter = EventEmitter.load();

  let triggered = [];
  emitter.on('trigger advance something', async x => {
    expect(x).toBe(1);
    triggered.push(1);
  });

  emitter.on('/trigger (advance) something/', async x => {
    expect(x).toBe(1);
    triggered.push(2);
    expect(emitter.meta.variables[0]).toBe('advance')
  }, 2);

  const actual = await emitter.emit('trigger advance something', 1);

  expect(triggered.length).toBe(2);
  expect(triggered[0]).toBe(2);
  expect(triggered[1]).toBe(1);
  expect(actual).toBe(EventEmitter.STATUS_OK);
});

test('trigger incomplete event', async () => {
  let emitter = EventEmitter.load();

  let triggered = [];
  emitter.on('trigger incomplete something', async x => {
    triggered.push(1);
  });

  emitter.on('/trigger (incomplete) something/', async x => {
    expect(x).toBe(1);
    triggered.push(2);
    return false;
  }, 2);

  const actual = await emitter.emit('trigger incomplete something', 1);

  expect(triggered.length).toBe(1);
  expect(triggered[0]).toBe(2);
  expect(actual).toBe(EventEmitter.STATUS_INCOMPLETE);
});

test('trigger unbind event', async () => {
  let emitter = EventEmitter.load();

  let triggered = [];
  emitter.on('trigger unbind something', async x => {
    triggered.push(1);
  });

  emitter.unbind('trigger unbind something');
  const actual = await emitter.emit('trigger unbind something');

  expect(triggered.length).toBe(0);
  expect(actual).toBe(EventEmitter.STATUS_NOT_FOUND);
});

test('event nesting', async () => {
  const emitter = EventEmitter.load();

  emitter.on('on something', async x => {
    expect(emitter.meta.event).toBe('on something');
    const actual = await emitter.emit('on something else', x + 1);
    expect(actual).toBe(200);
  });

  emitter.on('on something else', x => {
    expect(emitter.meta.event).toBe('on something else');
  });

  await emitter.emit('on something', 1);
});
