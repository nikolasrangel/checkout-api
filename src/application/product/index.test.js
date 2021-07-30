const test = require('ava')

const { getDatabase, getProductById, getGiftProduct } = require('./index')

test.before((t) => {
  const database = getDatabase('./products.json')

  return (t.context = {
    database,
  })
})

test('getDatabase > should successfully returns products database', (t) => {
  const database = getDatabase()

  t.true(typeof database.Product === 'object')
})

test('getDatabase > should return an empty database when an error occur loading database', (t) => {
  const database = getDatabase('invalid-json-products-file.json')

  t.deepEqual(database.Product, [])
})

test('getProductById > should successfully get a product by id', async (t) => {
  const { database } = t.context

  const productId = 1

  const product = await getProductById(database)(productId)

  t.true(typeof product === 'object')
  t.is(product.id, productId)
})

test('getProductById > should get undefined as result for a nonexistent product', async (t) => {
  const { database } = t.context

  const productId = 2021

  const product = await getProductById(database)(productId)

  t.is(product, null)
})

test('getProductById > should not throw an error when occur a problem with database communication', async (t) => {
  const productId = 42
  const databaseMock = {
    Product: {
      find: () => {
        throw new Error('Something really wrong happened :-(')
      },
    },
  }

  const product = await getProductById(databaseMock)(productId)

  t.is(product, null)
})

test('getGiftProduct > should successfully get a gift product', async (t) => {
  const { database } = t.context

  const giftProduct = await getGiftProduct(database)()

  t.true(typeof giftProduct === 'object')
  t.true(giftProduct.is_gift)
})

test('getGiftProduct > should not throw an error occur a problem with database communication', async (t) => {
  const databaseMock = {
    Product: {
      find: () => {
        throw new Error('Something really wrong happened :-(')
      },
    },
  }

  const giftProduct = await getGiftProduct(databaseMock)()

  t.is(giftProduct, null)
})
