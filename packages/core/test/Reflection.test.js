const { Reflection } = require('../src');

class BarInterface { bar() {} }
class FooInterface extends BarInterface { zoo() {} }

class Bar1 { bar() {} }
class Bar2 { bar() {} }
class ZooTrait { zoo() {} }

test('traits and interface test', async () => {
  let valid = true;

  try {
    Reflection(Bar1).uses(ZooTrait).implements(FooInterface);
  } catch(e) {
    valid = false;
  }

  expect(valid).toBe(true);

  valid = true;

  try {
    Reflection(Bar2).implements(FooInterface);
  } catch(e) {
    valid = false;
  }

  expect(valid).toBe(false);

  valid = true;

  try {
    Reflection(ZooTrait).implements(FooInterface);
  } catch(e) {
    valid = false;
  }

  expect(valid).toBe(false);
})

test('instanceof test', async () => {
  expect(Reflection(Bar1).instanceOf(Bar2)).toBe(true);

  const bar1 = new Bar1();
  const bar2 = new Bar2();

  expect(Reflection(bar1).instanceOf(Bar1)).toBe(true);
  expect(Reflection(bar2).instanceOf(Bar2)).toBe(true);
  expect(Reflection(bar1).instanceOf(Bar2)).toBe(true);
  expect(Reflection(bar1).instanceOf(Array)).toBe(false);

  expect(Reflection(bar2).instanceOf(Bar1)).toBe(false);

  bar2.zoo = function zoo() {};

  expect(Reflection(bar2).instanceOf(Bar1)).toBe(true);
})

test('getMethods test', async () => {
  expect(Object.keys(Reflection.getMethods(Bar1)).length).toBe(2)
  expect(Object.keys(Reflection.getMethods(Bar2)).length).toBe(1)
})
