const test = require('ava')
const request = require('supertest')

const { createServer } = require('../../../src/entrypoint/http')

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

  const response = await request(server)
    .post('/checkout')
    .send(requestBody)

  t.is(response.statusCode, 200)
})
