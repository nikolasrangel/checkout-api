const path = require('path')
const test = require('ava')

const { initialize } = require('./index')

test.before((t) => {
  const productsFilePath = '../../../application/product/products.json'

  return (t.context = {
    productsFilePath,
  })
})

test('initialize > should throw an error when json file does not exists', (t) => {
  const nonexistentJSON = 'missing-products-file.json'

  t.plan(2)

  try {
    initialize(nonexistentJSON)
  } catch (error) {
    t.true(
      error.message.includes("Cannot find module 'missing-products-file.json'")
    )

    return t.pass()
  }

  return t.fail()
})

test('initialize > should successfully return a JSON object from a existing file', (t) => {
  const { productsFilePath: filename } = t.context

  const jsonPath = path.resolve(__dirname, filename)

  const jsonObject = initialize(jsonPath)

  t.true(typeof jsonObject === 'object')
})
