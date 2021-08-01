const test = require('ava')

const { getDatabase } = require('./index')

test('getDatabase > should successfully returns products database', (t) => {
  const database = getDatabase('products.json')

  t.true(typeof database.Product === 'object')
  t.true(database.Product.length > 0)
})

test('getDatabase > should return an empty database when an error occur loading database', (t) => {
  const database = getDatabase('invalid-json-products-file.json')

  t.deepEqual(database.Product, [])
})
