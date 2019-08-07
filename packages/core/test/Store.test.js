const MemoryStore = require('../src/data/MemoryStore');

test('store search/detail/insert/update/remove test', async () => {
  const store = MemoryStore.load();
  let schema = store
    .makeSchema('wallet')
    .addField('wallet_address', 'string')
    .addField('wallet_amount', 'float', 0)
    .addValidation('wallet_amount', function(value, errors) {
      if (value < 0) {
        errors['wallet_amount'] = 'Cannot be less than 0'
      }
    });

  let collection = schema.makeCollection();

  let model1 = collection.makeModel({
    wallet_address: '0x1234567890',
    wallet_amount: 12.3456
  });

  await model1.save();

  expect(model1.get('wallet_id')).toBe(1);

  let model2 = collection.makeModel({
    wallet_address: '0x2345678901',
    wallet_amount: 23.4567
  });

  await model2.save();

  expect(model2.get('wallet_id')).toBe(2);

  let search = store
    .makeSearch('wallet')
    .where('eq', 'wallet_address', '0x2345678901');

  let rows = await search.getRows();
  expect(rows.length).toBe(1);

  search = store
    .makeSearch('wallet')
    .where('gt', 'wallet_amount', 10);

  rows = await search.getRows();
  expect(rows.length).toBe(2);

  model1.set('wallet_amount', 5.454);

  await model1.save();

  search = store
    .makeSearch('wallet')
    .where('gt', 'wallet_amount', 10);

  rows = await search.getRows();
  expect(rows.length).toBe(1);

  search = store.makeSearch('wallet');
  rows = await search.getRows();
  expect(rows.length).toBe(2);

  await model1.remove();

  search = store.makeSearch('wallet');
  rows = await search.getRows();
  expect(rows.length).toBe(1);
  expect(rows[0].wallet_id).toBe(2);
});
