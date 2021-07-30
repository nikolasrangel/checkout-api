const test = require('ava')

const {
  calculateTotalAmount,
  calculateTotalAmountWithDiscount,
  calculateTotalDiscount,
  createShoppingCart,
  addProductToShoppingCart,
} = require('./index')

const { createProductObject } = require('../product')

test.before((t) => {
  const giftProductMock = {
    id: 20,
    title: 'product gift title name',
    description: 'product gift description',
    amount: 100,
    is_gift: true,
  }

  const randomProduct = {
    id: 10,
    title: 'product title name',
    description: 'product description',
    amount: 200,
    is_gift: false,
  }

  t.context = {
    giftProduct: giftProductMock,
    product: randomProduct,
  }
})

test('createShoppingCart > create a shopping cart for one product', (t) => {
  const { product } = t.context
  const discount = 0.5
  const order = {
    id: product.id,
    quantity: 2,
  }

  const productObject = createProductObject(product, discount, order)
  const products = [productObject]

  const shoppingCart = createShoppingCart(products)

  t.deepEqual(shoppingCart.products, products)
  t.is(shoppingCart.total_amount, calculateTotalAmount(products))
  t.is(shoppingCart.total_discount, calculateTotalDiscount(products))
  t.is(
    shoppingCart.total_amount_with_discount,
    calculateTotalAmountWithDiscount(products)
  )
})

test('createShoppingCart > create a shopping cart for two products', (t) => {
  const { product } = t.context
  const discount = 0.5
  const order = {
    id: product.id,
    quantity: 2,
  }

  const productObject = createProductObject(product, discount, order)
  const products = [productObject, productObject]

  const shoppingCart = createShoppingCart(products)

  t.deepEqual(shoppingCart.products, products)
  t.is(shoppingCart.total_amount, calculateTotalAmount(products))
  t.is(shoppingCart.total_discount, calculateTotalDiscount(products))
  t.is(
    shoppingCart.total_amount_with_discount,
    calculateTotalAmountWithDiscount(products)
  )
})

test('addProductToShoppingCart > should add a valid product to shopping cart', (t) => {
  const { giftProduct: newProduct } = t.context
  const shoppingCart = {
    total_amount: 15000,
    total_amount_with_discount: 13500,
    total_discount: 1500,
    products: [
      {
        id: 1,
        quantity: 1,
        unit_amount: 15000,
        total_amount: 15000,
        discount: 1500,
        is_gift: false,
      },
    ],
  }

  const shoppingCartWithNewProduct = addProductToShoppingCart(
    shoppingCart,
    newProduct
  )

  const originalShoppingCartLength = shoppingCart.products.length
  const newShoppingCartLength = shoppingCartWithNewProduct.products.length

  t.is(newShoppingCartLength, originalShoppingCartLength + 1)
})

test('addProductToShoppingCart > should not add an invalid product to shopping cart', (t) => {
  const invalidProduct = null
  const shoppingCart = {
    total_amount: 15000,
    total_amount_with_discount: 13500,
    total_discount: 1500,
    products: [
      {
        id: 1,
        quantity: 1,
        unit_amount: 15000,
        total_amount: 15000,
        discount: 1500,
        is_gift: false,
      },
    ],
  }

  const shoppingCartWithNewProduct = addProductToShoppingCart(
    shoppingCart,
    invalidProduct
  )

  const originalShoppingCartLength = shoppingCart.products.length
  const newShoppingCartLength = shoppingCartWithNewProduct.products.length

  t.is(newShoppingCartLength, originalShoppingCartLength)
})
