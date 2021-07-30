const { getLogger } = require('../../infra/logger')

const getProductPercentageDiscount =
  (discountClient) =>
  async (productId, logger = getLogger()) => {
    try {
      const percentageDiscount =
        await discountClient.getProductPercentageDiscount(productId)

      logger.info({
        message: `Receive with success discount for product: #${productId}`,
        discount: percentageDiscount,
        product: productId,
      })

      return percentageDiscount
    } catch (error) {
      logger.error({
        message: `Error getting discount for product: #${productId}`,
        product: productId,
        error: error.message,
        stack: error.stack || undefined,
      })

      return 0
    }
  }

module.exports = {
  getProductPercentageDiscount,
}
