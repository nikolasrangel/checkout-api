const test = require('ava')

const { calculateProductDiscount, createProductObject } = require('./index')

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

test('calculateProductDiscount > should throw an error when amount argument is not a number', (t) => {
  t.plan(2)

  try {
    calculateProductDiscount('not-a-number', 0.2)
  } catch (error) {
    t.is(error.message, 'Amount argument must be a number')

    return t.pass()
  }

  return t.fail()
})

test('calculateProductDiscount > should throw an error when discount percentage argument is not a number', (t) => {
  t.plan(2)

  try {
    calculateProductDiscount(100, 'not-a-number')
  } catch (error) {
    t.is(error.message, 'Percentage discount argument must be a number')

    return t.pass()
  }

  return t.fail()
})

test('calculateProductDiscount > should not apply any discount when discount argument is 0', (t) => {
  const productAmount = 20000
  const percentageDiscount = 0

  const productDiscount = calculateProductDiscount(
    productAmount,
    percentageDiscount
  )

  t.is(productDiscount, 0)
})

test('calculateProductDiscount > should not apply any discount when discount argument is 0.00', (t) => {
  const productAmount = 20000
  const percentageDiscount = 0.0

  const productDiscount = calculateProductDiscount(
    productAmount,
    percentageDiscount
  )

  t.is(productDiscount, 0)
})

test('calculateProductDiscount > should correctly apply the discount when percentage discount argument is as number as string', (t) => {
  const productAmount = 20000
  const percentageDiscount = '0.20'

  const productDiscount = calculateProductDiscount(
    productAmount,
    percentageDiscount
  )

  t.is(productDiscount, 4000)
})

test('calculateProductDiscount > should correctly apply the discount when percentage discount argument is a number', (t) => {
  const productAmount = 20000
  const percentageDiscount = 0.2

  const productDiscount = calculateProductDiscount(
    productAmount,
    percentageDiscount
  )

  t.is(productDiscount, 4000)
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
