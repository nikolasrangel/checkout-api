const test = require('ava')
const request = require('supertest')
const { equals } = require('ramda')

const { createServer, closeServer } = require('../../../src/entrypoint/http')

const expectedProductProperties = [
  'id',
  'quantity',
  'unit_amount',
  'total_amount',
  'discount',
  'is_gift',
]

test.before((t) => {
  const server = createServer()

  t.context = {
    server,
  }
})

test('server http > should get a response with 200 as status code from health check endpoint', async (t) => {
  const { server } = t.context

  const response = await request(server).get('/_health_check')

  t.is(response.text, 'ok')
  t.is(response.statusCode, 200)
})

test('server http > should get a response with 500 as status code from a invalid request to checkout endpoint', async (t) => {
  const { server } = t.context

  const invalidRequestBody = {
    id: 1,
    quantity: 2,
  }

  const response = await request(server)
    .post('/checkout')
    .send(invalidRequestBody)

  t.is(response.text, 'Internal error')
  t.is(response.statusCode, 500)
})

test('server http > should get a response with 200 as status code from a valid request to checkout endpoint', async (t) => {
  const { server } = t.context

  const requestBody = {
    products: [
      {
        id: 1,
        quantity: 2,
      },
    ],
  }

  const response = await request(server).post('/checkout').send(requestBody)

  t.is(response.statusCode, 200)
})

test('server http > should get a checkout with products containing all expected properties', async (t) => {
  const { server } = t.context

  const requestBody = {
    products: [
      {
        id: 1,
        quantity: 2,
      },
    ],
  }

  const response = await request(server).post('/checkout').send(requestBody)

  const { products } = response.body

  const productsContainAllExpectedKeys = products.every((product) => {
    const productProperties = Object.keys(product)

    return equals(productProperties, expectedProductProperties)
  })

  t.is(response.statusCode, 200)
  t.true(productsContainAllExpectedKeys)
})

test('server http > should get a shopping cart without gift when it is not Black Friday', async (t) => {
  const server = createServer({
    port: 8001,
    isBlackFriday: false,
  })

  const requestBody = {
    products: [
      {
        id: 1,
        quantity: 2,
      },
    ],
  }

  const response = await request(server).post('/checkout').send(requestBody)
  const shoppingCart = response.body

  const productsQuantityFromRequest = requestBody.products.length
  const productsQuantityFromResponse = shoppingCart.products.length

  t.is(response.statusCode, 200)
  t.is(productsQuantityFromResponse, productsQuantityFromRequest)

  closeServer(server)
})

test('server http > should get a shopping cart with gift when it is Black Friday', async (t) => {
  const server = createServer({
    port: 8001,
    isBlackFriday: true,
  })

  const requestBody = {
    products: [
      {
        id: 1,
        quantity: 2,
      },
    ],
  }

  const response = await request(server).post('/checkout').send(requestBody)
  const shoppingCart = response.body

  const productsQuantityFromRequest = requestBody.products.length
  const productsQuantityFromResponse = shoppingCart.products.length

  t.is(response.statusCode, 200)
  t.is(productsQuantityFromResponse, productsQuantityFromRequest + 1)

  closeServer(server)
})

test('server http > should get a shopping cart with gift when it is Black Friday and all products must contain the expected properties', async (t) => {
  const server = createServer({
    port: 8001,
    isBlackFriday: true,
  })

  const requestBody = {
    products: [
      {
        id: 1,
        quantity: 2,
      },
    ],
  }

  const response = await request(server).post('/checkout').send(requestBody)
  const shoppingCart = response.body

  const productsQuantityFromRequest = requestBody.products.length
  const productsQuantityFromResponse = shoppingCart.products.length

  const productsContainAllExpectedKeys = shoppingCart.products.every(
    (product) => {
      const productProperties = Object.keys(product)

      return equals(productProperties, expectedProductProperties)
    }
  )

  t.is(response.statusCode, 200)
  t.is(productsQuantityFromResponse, productsQuantityFromRequest + 1)
  t.true(productsContainAllExpectedKeys)

  closeServer(server)
})

test('server http > should get a shopping cart even if discount server can not be accessed', async (t) => {
  const server = createServer({
    port: 8001,
    isBlackFriday: true,
    serverDiscountAddress: 'not-a-valid-discount-address:50051',
  })

  const requestBody = {
    products: [
      {
        id: 1,
        quantity: 2,
      },
    ],
  }

  const response = await request(server).post('/checkout').send(requestBody)
  const shoppingCart = response.body

  const productsContainAllExpectedKeys = shoppingCart.products.every(
    (product) => {
      const productProperties = Object.keys(product)

      return equals(productProperties, expectedProductProperties)
    }
  )

  t.is(response.statusCode, 200)
  t.true(productsContainAllExpectedKeys)
  t.is(shoppingCart.total_discount, 0)

  closeServer(server)
})
