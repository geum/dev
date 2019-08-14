const Defintion = require('../src/Definition');

class BarInterface { bar() {} }
class FooInterface extends BarInterface { zoo() {} }

class Bar1 { bar() {} }
class Bar2 { bar() {} }
class ZooTrait { zoo() {} }

test('traits and interface test', async () => {
  let valid = true;

  try {
    Defintion(Bar1)
      .uses(ZooTrait)
      .implements(FooInterface);
  } catch(e) {
    valid = false;
  }

  expect(valid).toBe(true);

  valid = true;

  try {
    Defintion(Bar2).implements(FooInterface);
  } catch(e) {
    valid = false;
  }

  expect(valid).toBe(false);

  valid = true;

  try {
    Defintion(ZooTrait).implements(FooInterface);
  } catch(e) {
    valid = false;
  }

  expect(valid).toBe(false);
})

test('instanceof test', async () => {
  expect(Defintion(Bar1).instanceOf(Bar2)).toBe(true);

  const bar1 = new Bar1();
  const bar2 = new Bar2();

  expect(Defintion(bar1).instanceOf(Bar1)).toBe(true);
  expect(Defintion(bar2).instanceOf(Bar2)).toBe(true);
  expect(Defintion(bar1).instanceOf(Bar2)).toBe(true);
  expect(Defintion(bar1).instanceOf(Array)).toBe(false);

  expect(Defintion(bar2).instanceOf(Bar1)).toBe(false);

  bar2.zoo = function zoo() {};

  expect(Defintion(bar2).instanceOf(Bar1)).toBe(true);
})
