const { Registry, Request, Response } = require('../src');

test('Registry set/has/remove/get', () => {
  let registry = Registry.load();
  registry.set('foo', 'bar', 'zoo');
  registry.set('foo', 'zoo', ['foo', 'bar', 'zoo']);

  expect(registry.has('foo', 'bar')).toBe(true);
  expect(registry.has('bar', 'foo')).toBe(false);
  expect(registry.get('foo', 'zoo', 1)).toBe('bar');

  registry.remove('foo', 'bar');
  expect(registry.has('foo', 'bar')).toBe(false);
  expect(registry.has('foo', 'zoo')).toBe(true);

  //foo=bar&zoo[]=1&zoo[]=2&zoo[]=3&product[title]=test
  //&product[price]=1000&product[rating][]=1&product[rating][]=2
  //&product[rating][]=3&product[abstract][][name]=john
  //&product[abstract][][name]=james&boom[]=1
  registry = Registry.load();
  registry.set('foo', 'bar');
  registry.set('zoo', '', 1);
  registry.set('zoo', '', 2);
  registry.set('zoo', '', 3);
  registry.set('product', 'title', 'test');
  registry.set('product', 'price', 1000);
  registry.set('product', 'rating', '', 1);
  registry.set('product', 'rating', '', 2);
  registry.set('product', 'rating', '', 3);
  registry.set('product', 'abstract', '', 'name', 'john');
  registry.set('product', 'abstract', '', 'name', 'james');
  registry.set('boom', '', 1);

  const expected = '{"foo":"bar","zoo":[1,2,3],"product":{"title":"test",'
    + '"price":1000,"rating":[1,2,3],"abstract":[{"name":"john"},'
    + '{"name":"james"}]},"boom":[1]}';

  const actual = JSON.stringify(registry.get());

  expect(actual).toBe(expected);
});

test('Registry each', () => {
  const registry = Registry
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
});

test('Request/Response test', () => {
  const request = Request.load();
  request.setStage('foo', 'bar');
  expect(request.get('stage', 'foo')).toBe('bar');

  const response = Response.load();
  response.setResults('foo', 'bar');
  expect(response.get('json', 'results', 'foo')).toBe('bar');
});
