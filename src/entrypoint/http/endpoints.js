const shoppingCartApplication = require('../../application/shopping_cart')

const checkoutHandler = (server) => async (request, response) => {
  const { logger, database, clients, features } = server

  // TODO: apply a validation based in a expected schema on body request
  const { body } = request

  logger.info({
    message: 'Creating a shopping cart',
    request: body,
  })

  try {
    const shoppingCart = await shoppingCartApplication.createShoppingCart(
      {
        productDatabase: database.product,
        discountClient: clients.discount,
      },
      { isBlackFriday: features.isBlackFriday }
    )(body.products)

    return response.status(200).send(shoppingCart)
  } catch (error) {
    logger.error({
      message: 'Error creating shopping cart',
      request: body,
      error: error.message,
      stack: error.stack,
    })

    return response.status(500).send('Internal error')
  }
}

const createCheckoutEndpoint = (server) => {
  return {
    method: 'post',
    endpoint: '/checkout',
    handler: checkoutHandler(server),
  }
}

module.exports = {
  createCheckoutEndpoint,
}
