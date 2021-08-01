const { getLogger } = require('../../infra/logger')

const getProductById =
  (database) =>
  async (id, logger = getLogger()) => {
    try {
      const product = database.Product.find((product) => product.id === id)

      return product ? product : null
    } catch (error) {
      logger.error({
        message: `Error finding product with id: #${id}`,
        error: error.message,
      })

      return null
    }
  }

const getGiftProduct =
  (database) =>
  async (logger = getLogger()) => {
    try {
      const productGift = database.Product.find(
        (product) => product.is_gift === true
      )

      return productGift ? productGift : null
    } catch (error) {
      const errorMessage = 'Can not find gift product in database'

      logger.error({
        message: errorMessage,
        error: error.message,
      })

      return null
    }
  }

module.exports = {
  getProductById,
  getGiftProduct,
}
