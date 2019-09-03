class Chainable {
  constructor() {
    this.data = {};
  }

  set(name, value) {
    this.data[name] = value;
    return this;
  }

  async get(name) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.data[name]);
      }, 100)
    });
  }

  then(callback) {
    setTimeout(() => {
      callback(this.data);
    }, 100)
  }
}

test('async/await understanding', async() => {
  const chain = new Chainable();
  let actual = await chain
    .set('foo', 'bar')
    .set('bar', 'zoo')
    .get('foo');

  expect(actual).toBe('bar');

  actual = await chain
    .set('foo', 'bar')
    .set('bar', 'zoo');

  expect(actual['foo']).toBe('bar');
});

test('async/await understanding 2', async() => {
  const promise = function() {
    return {
      then(callback) {
        setTimeout(() => {
          callback(1)
        }, 100)
      }
    }
  };

  const actual = await promise();
  expect(actual).toBe(1);
});
