const test = require('ava')

const { getDatabase, getProductById, getGiftProduct } = require('./index')

test('getDatabase > should successfully returns products database', (t) => {
  const database = getDatabase()

  t.true(typeof database.Product === 'object')
})

test('getDatabase > should return an empty database when an error occur loading database', (t) => {
  const database = getDatabase('invalid-json-products-file.json')

  t.deepEqual(database.Product, [])
})

test('getProductById > should successfully get a product by id', async (t) => {
  const productId = 1

  const product = await getProductById(productId)

  t.true(typeof product === 'object')
  t.is(product.id, productId)
})

test('getProductById > should get undefined as result for a nonexistent product', async (t) => {
  const productId = 2021

  const product = await getProductById(productId)

  t.is(product, null)
})

test('getProductById > should throw an error when can not find a product', async (t) => {
  const productId = 42
  const databaseMock = {
    Product: {
      find: () => {
        throw new Error('Something really wrong happened :-(')
      },
    },
  }

  t.plan(2)

  try {
    await getProductById(productId, databaseMock)
  } catch (error) {
    t.is(error.message, `Can not find product with id: #${productId}`)

    return t.pass()
  }

  return t.fail()
})

test('getGiftProduct > should successfully get a gift product', async (t) => {
  const giftProduct = await getGiftProduct()

  t.true(typeof giftProduct === 'object')
  t.true(giftProduct.is_gift)
})

test('getGiftProduct > should throw an error when can not find a gift product', async (t) => {
  const databaseMock = {
    Product: {
      find: () => {
        throw new Error('Something really wrong happened :-(')
      },
    },
  }

  t.plan(2)

  try {
    await getGiftProduct(databaseMock)
  } catch (error) {
    t.is(error.message, 'Can not find gift product in database')

    return t.pass()
  }

  return t.fail()
})
