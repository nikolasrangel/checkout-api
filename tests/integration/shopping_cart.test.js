const test = require('ava')

const { getDatabase } = require('../../src/infra/product-database')
const { createDiscountClient } = require('../../src/infra/discount-client')
const { createShoppingCart } = require('../../src/application/shopping_cart')

test.before((t) => {
  const {
    DISCOUNT_SERVER_ADDRESS: discountServerAddress,
    PRODUCT_DATABASE_ADDRESS: productDatabaseAddress,
  } = process.env

  const productDatabase = getDatabase(productDatabaseAddress)
  const discountClient = createDiscountClient(discountServerAddress)

  return (t.context = {
    dependencies: {
      productDatabase,
      discountClient,
    },
  })
})

test('createShoppingCart > should create a shopping cart', async (t) => {
  const { dependencies } = t.context

  const orders = [
    {
      id: 1,
      quantity: 2,
    },
    {
      id: 2,
      quantity: 2,
    },
  ]

  const shoppingCart = await createShoppingCart(dependencies)(orders)
  const shoppingCartProperties = Object.keys(shoppingCart)

  t.true(shoppingCartProperties.includes('total_amount'))
  t.true(shoppingCartProperties.includes('total_amount_with_discount'))
  t.true(shoppingCartProperties.includes('total_discount'))
  t.true(shoppingCartProperties.includes('products'))
  t.true(Array.isArray(shoppingCart.products))
  t.is(shoppingCart.products.length, orders.length)
})

test('createShoppingCart > should create a shopping cart even if one product does not exists in product database', async (t) => {
  const { dependencies } = t.context

  const orders = [
    {
      id: 1,
      quantity: 2,
    },
    {
      id: 777777,
      quantity: 2,
    },
  ]

  const shoppingCart = await createShoppingCart(dependencies)(orders)
  const shoppingCartProperties = Object.keys(shoppingCart)

  t.true(shoppingCartProperties.includes('total_amount'))
  t.true(shoppingCartProperties.includes('total_amount_with_discount'))
  t.true(shoppingCartProperties.includes('total_discount'))
  t.true(shoppingCartProperties.includes('products'))
  t.true(Array.isArray(shoppingCart.products))
  t.is(shoppingCart.products.length, orders.length - 1)
})

test('createShoppingCart > should create a shopping cart with an additional product when Black Friday', async (t) => {
  const { dependencies } = t.context

  const orders = [
    {
      id: 1,
      quantity: 2,
    },
    {
      id: 2,
      quantity: 2,
    },
  ]
  const options = {
    isBlackFriday: true,
  }

  const shoppingCart = await createShoppingCart(dependencies, options)(orders)
  const shoppingCartProperties = Object.keys(shoppingCart)
  const shoppingCartHasGiftProdut = shoppingCart.products.some(
    (product) => product.is_gift === true
  )

  t.true(shoppingCartProperties.includes('total_amount'))
  t.true(shoppingCartProperties.includes('total_amount_with_discount'))
  t.true(shoppingCartProperties.includes('total_discount'))
  t.true(shoppingCartProperties.includes('products'))
  t.true(Array.isArray(shoppingCart.products))
  t.is(shoppingCart.products.length, orders.length + 1)
  t.true(shoppingCartHasGiftProdut)
})
