const test = require('ava')

const {
  calculateTotalAmount,
  calculateTotalAmountWithDiscount,
  calculateTotalDiscount,
  createProductObject,
  createShoppingCart,
} = require('./index')

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

test('createProductObject > should create a product object for a gift with 1 as quantity and 0 for amount and discount', (t) => {
  const { giftProduct } = t.context

  const productObject = createProductObject(giftProduct)

  t.deepEqual(productObject, {
    id: giftProduct.id,
    quantity: 1,
    unit_amount: 0,
    total_amount: 0,
    discount: 0,
    is_gift: true,
  })
})

test('createProductObject > should create a product object for a produt which is not a gift', (t) => {
  const { product } = t.context
  const discount = 0.5
  const order = {
    id: product.id,
    quantity: 2,
  }

  const productObject = createProductObject(product, discount, order)

  const totalAmount = product.amount * order.quantity
  const totalDiscount = discount * totalAmount

  t.deepEqual(productObject, {
    id: product.id,
    quantity: order.quantity,
    unit_amount: product.amount,
    total_amount: totalAmount,
    discount: totalDiscount,
    is_gift: false,
  })
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
