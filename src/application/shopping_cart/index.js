const productDomain = require('../../domain/product')
const shoppingCartDomain = require('../../domain/shopping_cart')
const discountApplication = require('../discount')
const productApplication = require('../product')

const createShoppingCartProduct = async (
  order,
  productDatabase,
  discountClient
) => {
  const productPromise = productApplication.getProductById(productDatabase)(
    order.id
  )
  const discountPromise = discountApplication.getProductPercentageDiscount(
    discountClient
  )(order.id)

  const [product, discount] = await Promise.all([
    productPromise,
    discountPromise,
  ])

  if (!product) {
    return null
  }

  const productObject = productDomain.createProductObject(
    product,
    discount,
    order
  )

  return productObject
}

const createShoppingCart =
  (dependencies, options = {}) =>
  async (orders) => {
    const { productDatabase, discountClient } = dependencies
    const { isBlackFriday } = options

    const productObjectsPromises = orders.map((order) =>
      createShoppingCartProduct(order, productDatabase, discountClient)
    )
    const productsObjets = await Promise.all(productObjectsPromises)

    const shoppingCart = shoppingCartDomain.createShoppingCart(productsObjets)

    const shouldAddGiftProduct =
      shoppingCartDomain.shouldAddGiftProduct(isBlackFriday)

    if (shouldAddGiftProduct) {
      const giftProduct = await productApplication.getGiftProduct(
        productDatabase
      )()

      const shoppingCartWithGiftProduct =
        shoppingCartDomain.addProductToShoppingCart(shoppingCart, giftProduct)

      return shoppingCartWithGiftProduct
    }

    return shoppingCart
  }

module.exports = {
  createShoppingCartProduct,
  createShoppingCart,
}
