const test = require('ava')
const { spy } = require('sinon')

const { getProductPercentageDiscount } = require('./index')

test('getProductPercentageDiscount > should call logger.error and return 0 as discount when an error occur', async (t) => {
  const productId = 42
  const discountClientMock = {
    getProductPercentageDiscount: async () => {
      throw new Error('Internal error')
    },
  }
  const loggerSpy = {
    error: spy(),
  }

  const discount = await getProductPercentageDiscount(discountClientMock)(
    productId,
    loggerSpy
  )

  const { firstArg: loggerCallArguments } = loggerSpy.error.firstCall

  t.is(discount, 0)
  t.true(loggerSpy.error.calledOnce)
  t.like(loggerCallArguments, {
    message: 'Error getting discount for product: #42',
    product: productId,
    error: 'Internal error',
  })
})

test('getProductPercentageDiscount > should call logger.info and return the discount when no error occur', async (t) => {
  const productId = 20
  const discountClientMock = {
    getProductPercentageDiscount: async () => 0.15,
  }
  const loggerSpy = {
    info: spy(),
  }

  const discount = await getProductPercentageDiscount(discountClientMock)(
    productId,
    loggerSpy
  )

  const { firstArg: loggerCallArguments } = loggerSpy.info.firstCall

  t.is(discount, 0.15)
  t.true(loggerSpy.info.calledOnce)
  t.like(loggerCallArguments, {
    message: 'Receive with success discount for product: #20',
    product: productId,
  })
})
