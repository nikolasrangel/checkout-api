const test = require('ava')

const { calculateProductDiscount } = require('./index')

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
