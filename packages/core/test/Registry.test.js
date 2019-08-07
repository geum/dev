const DataRegistry = require('../src/data/DataRegistry');

test('Registry set/has/remove/get', () => {
  const registry = DataRegistry
    .load()
    .set('foo', 'bar', 'zoo')
    .set('foo', 'zoo', ['foo', 'bar', 'zoo']);

  expect(registry.has('foo', 'bar')).toBe(true);
  expect(registry.has('bar', 'foo')).toBe(false);
  expect(registry.get('foo', 'zoo', 1)).toBe('bar');

  registry.remove('foo', 'bar');
  expect(registry.has('foo', 'bar')).toBe(false);
  expect(registry.has('foo', 'zoo')).toBe(true);
});

test('Registry each', () => {
  const registry = DataRegistry
    .load()
    .set('foo', 'bar', 'zoo')
    .set('foo', 'zoo', ['foo', 'bar', 'zoo']);

  let count = 0;
  registry.each('foo', 'zoo', function(value, i) {
    if (i == 0) {
      count++;
      expect(value).toBe('foo');
    } else if (i == 1) {
      count++;
      expect(value).toBe('bar');
      return false;
    }
  });

  expect(count).toBe(2);

  count = 0;
  registry.each('foo', function(value, key) {
    count++;
    expect(key).toBe('bar');
    return false;
  });

  expect(count).toBe(1);
})
