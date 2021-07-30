const test = require('ava')
const { stub } = require('sinon')

const { createShoppingCartProduct, createShoppingCart } = require('./index')
const productApplication = require('../product')

test('createShoppingCartProduct > should successfully create a shopping cart product', async (t) => {
  const product = {
    id: 1,
    title: 'Calça',
    description: 'Calça que vira bermuda.',
    amount: 15000,
    is_gift: false,
  }
  const discountPercentage = 0.1

  const productDatabaseMock = {
    Product: [product],
  }
  const discountClientMock = {
    getProductPercentageDiscount: () => Promise.resolve(discountPercentage),
  }
  const order = {
    id: 1,
    quantity: 5,
  }

  const shoppingCartProduct = await createShoppingCartProduct(
    order,
    productDatabaseMock,
    discountClientMock
  )

  const totalAmount = product.amount * order.quantity
  const totalDiscount = discountPercentage * totalAmount

  t.is(shoppingCartProduct.id, order.id)
  t.is(shoppingCartProduct.quantity, order.quantity)
  t.is(shoppingCartProduct.unit_amount, product.amount)
  t.is(shoppingCartProduct.total_amount, totalAmount)
  t.is(shoppingCartProduct.discount, totalDiscount)
})

test('createShoppingCartProduct > should return null when can not find product in database due to error', async (t) => {
  const discountPercentage = 0.1
  const productDatabaseMock = {
    Product: {
      find: () => {
        throw new Error('Something wrong happened')
      },
    },
  }
  const discountClientMock = {
    getProductPercentageDiscount: () => Promise.resolve(discountPercentage),
  }
  const order = {
    id: 1,
    quantity: 5,
  }

  const shoppingCartProduct = await createShoppingCartProduct(
    order,
    productDatabaseMock,
    discountClientMock
  )

  t.is(shoppingCartProduct, null)
})

test('createShoppingCartProduct > should return null when product does not exist in database', async (t) => {
  const discountPercentage = 0.1
  const productDatabaseMock = {
    Product: {
      find: () => undefined,
    },
  }
  const discountClientMock = {
    getProductPercentageDiscount: () => Promise.resolve(discountPercentage),
  }
  const order = {
    id: 1,
    quantity: 5,
  }

  const shoppingCartProduct = await createShoppingCartProduct(
    order,
    productDatabaseMock,
    discountClientMock
  )

  t.is(shoppingCartProduct, null)
})

test('createShoppingCart > should successfully create a shopping cart with all properties', async (t) => {
  const products = [
    {
      id: 1,
      title: 'Calça',
      description: 'Calça que vira bermuda.',
      amount: 15000,
      is_gift: false,
    },
    {
      id: 2,
      title: 'Bermuda',
      description: 'Bermuda que vira calça.',
      amount: 7500,
      is_gift: false,
    },
  ]
  const productDatabaseMock = {
    Product: products,
  }

  const discountPercentage = 0.1
  const discountClientMock = {
    getProductPercentageDiscount: () => Promise.resolve(discountPercentage),
  }

  const dependencies = {
    productDatabase: productDatabaseMock,
    discountClient: discountClientMock,
  }
  const orders = [
    { id: 1, quantity: 1 },
    { id: 2, quantity: 2 },
  ]

  const shoppingCart = await createShoppingCart(dependencies)(orders)

  const shoppingCartProperties = Object.keys(shoppingCart)

  t.true(shoppingCartProperties.includes('total_amount'))
  t.true(shoppingCartProperties.includes('total_amount_with_discount'))
  t.true(shoppingCartProperties.includes('total_discount'))
  t.true(shoppingCartProperties.includes('products'))
  t.true(Array.isArray(shoppingCart.products))
})

test('createShoppingCart > should successfully create a shopping cart without null values when can not find products in database', async (t) => {
  const products = [
    {
      id: 1,
      title: 'Calça',
      description: 'Calça que vira bermuda.',
      amount: 15000,
      is_gift: false,
    },
    {
      id: 2,
      title: 'Bermuda',
      description: 'Bermuda que vira calça.',
      amount: 7500,
      is_gift: false,
    },
  ]
  const productDatabaseMock = {
    Product: products,
  }

  const discountPercentage = 0.1
  const discountClientMock = {
    getProductPercentageDiscount: () => Promise.resolve(discountPercentage),
  }

  const dependencies = {
    productDatabase: productDatabaseMock,
    discountClient: discountClientMock,
  }
  const orders = [
    { id: 1, quantity: 1 },
    { id: 42, quantity: 2 },
  ]

  const shoppingCart = await createShoppingCart(dependencies)(orders)

  t.is(shoppingCart.products.length, 1)
})

test('createShoppingCart > should successfully create a shopping cart with an additional gift product when Black Friday', async (t) => {
  const products = [
    {
      id: 1,
      title: 'Calça',
      description: 'Calça que vira bermuda.',
      amount: 15000,
      is_gift: false,
    },
    {
      id: 2,
      title: 'Bermuda',
      description: 'Bermuda que vira calça.',
      amount: 7500,
      is_gift: false,
    },
    {
      id: 3,
      title: 'Chinelo',
      description: 'Chinelo simples.',
      amount: 1500,
      is_gift: true,
    },
  ]
  const productDatabaseMock = {
    Product: products,
  }

  const discountPercentage = 0.1
  const discountClientMock = {
    getProductPercentageDiscount: () => Promise.resolve(discountPercentage),
  }

  const isBlackFriday = true

  const dependencies = {
    productDatabase: productDatabaseMock,
    discountClient: discountClientMock,
  }
  const options = { isBlackFriday }
  const orders = [
    { id: 1, quantity: 1 },
    { id: 2, quantity: 2 },
  ]

  const shoppingCart = await createShoppingCart(dependencies, options)(orders)

  const orderProductsQuantity = orders.length
  const shoppingCartProductsQuantity = shoppingCart.products.length
  const shoppingCartHasGiftProdut = shoppingCart.products.some(
    (product) => product.is_gift === true
  )

  t.is(shoppingCartProductsQuantity, orderProductsQuantity + 1)
  t.true(shoppingCartHasGiftProdut)
})

test('createShoppingCart > should successfully create a shopping cart without an additional gift product when Black Friday and can not find gift product in database', async (t) => {
  const products = [
    {
      id: 1,
      title: 'Calça',
      description: 'Calça que vira bermuda.',
      amount: 15000,
      is_gift: false,
    },
    {
      id: 2,
      title: 'Bermuda',
      description: 'Bermuda que vira calça.',
      amount: 7500,
      is_gift: false,
    },
    {
      id: 3,
      title: 'Chinelo',
      description: 'Chinelo simples.',
      amount: 1500,
      is_gift: true,
    },
  ]
  const productDatabaseMock = {
    Product: products,
  }

  const discountPercentage = 0.1
  const discountClientMock = {
    getProductPercentageDiscount: () => Promise.resolve(discountPercentage),
  }

  const isBlackFriday = true

  const dependencies = {
    productDatabase: productDatabaseMock,
    discountClient: discountClientMock,
  }
  const options = { isBlackFriday }
  const orders = [
    { id: 1, quantity: 1 },
    { id: 2, quantity: 2 },
  ]

  const getGiftProductStub = stub(productApplication, 'getGiftProduct').returns(
    () => null
  )

  const shoppingCart = await createShoppingCart(dependencies, options)(orders)

  const orderProductsQuantity = orders.length
  const shoppingCartProductsQuantity = shoppingCart.products.length
  const shoppingCartHasGiftProdut = shoppingCart.products.some(
    (product) => product.is_gift === true
  )

  t.is(shoppingCartProductsQuantity, orderProductsQuantity)
  t.false(shoppingCartHasGiftProdut)

  getGiftProductStub.restore()
})

test('createShoppingCart > should successfully create a shopping cart without an additional gift product when it is not Black Friday', async (t) => {
  const products = [
    {
      id: 1,
      title: 'Calça',
      description: 'Calça que vira bermuda.',
      amount: 15000,
      is_gift: false,
    },
    {
      id: 2,
      title: 'Bermuda',
      description: 'Bermuda que vira calça.',
      amount: 7500,
      is_gift: false,
    },
    {
      id: 3,
      title: 'Chinelo',
      description: 'Chinelo simples.',
      amount: 1500,
      is_gift: true,
    },
  ]
  const productDatabaseMock = {
    Product: products,
  }

  const discountPercentage = 0.1
  const discountClientMock = {
    getProductPercentageDiscount: () => Promise.resolve(discountPercentage),
  }

  const isBlackFriday = false

  const dependencies = {
    productDatabase: productDatabaseMock,
    discountClient: discountClientMock,
  }
  const options = { isBlackFriday }
  const orders = [
    { id: 1, quantity: 1 },
    { id: 2, quantity: 2 },
  ]

  const shoppingCart = await createShoppingCart(dependencies, options)(orders)

  const orderProductsQuantity = orders.length
  const shoppingCartProductsQuantity = shoppingCart.products.length
  const shoppingCartHasGiftProdut = shoppingCart.products.some(
    (product) => product.is_gift === true
  )

  t.is(shoppingCartProductsQuantity, orderProductsQuantity)
  t.false(shoppingCartHasGiftProdut)
})
