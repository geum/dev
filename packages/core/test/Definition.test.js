const { Definition } = require('../src');

class BarInterface { bar() {} }
class FooInterface extends BarInterface { zoo() {} }

class Bar1 { bar() {} }
class Bar2 { bar() {} }
class ZooTrait { zoo() {} }

test('traits and interface test', async () => {
  let valid = true;

  try {
    Definition(Bar1)
      .uses(ZooTrait)
      .implements(FooInterface);
  } catch(e) {
    valid = false;
  }

  expect(valid).toBe(true);

  valid = true;

  try {
    Definition(Bar2).implements(FooInterface);
  } catch(e) {
    valid = false;
  }

  expect(valid).toBe(false);

  valid = true;

  try {
    Definition(ZooTrait).implements(FooInterface);
  } catch(e) {
    valid = false;
  }

  expect(valid).toBe(false);
})

test('instanceof test', async () => {
  expect(Definition(Bar1).instanceOf(Bar2)).toBe(true);

  const bar1 = new Bar1();
  const bar2 = new Bar2();

  expect(Definition(bar1).instanceOf(Bar1)).toBe(true);
  expect(Definition(bar2).instanceOf(Bar2)).toBe(true);
  expect(Definition(bar1).instanceOf(Bar2)).toBe(true);
  expect(Definition(bar1).instanceOf(Array)).toBe(false);

  expect(Definition(bar2).instanceOf(Bar1)).toBe(false);

  bar2.zoo = function zoo() {};

  expect(Definition(bar2).instanceOf(Bar1)).toBe(true);
})

test('getMethods test', async () => {
  expect(Object.keys(Definition.getMethods(Bar1)).length).toBe(2)
  expect(Object.keys(Definition.getMethods(Bar2)).length).toBe(1)
})
