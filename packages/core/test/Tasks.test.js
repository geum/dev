const { TaskQueue } = require('../src');

test('task run test', async () => {
  const queue = TaskQueue.load();

  let triggered = [];

  queue.push(async x => {
    triggered.push(x + 1);
  }).shift(async x => {
    triggered.push(x + 2);
  }).add(async x => {
    triggered.push(x + 3);
  }, 10);

  await queue.run(1);

  expect(triggered[0]).toBe(4);
  expect(triggered[1]).toBe(3);
  expect(triggered[2]).toBe(2);
});
