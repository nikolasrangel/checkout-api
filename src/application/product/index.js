const path = require('path')
const { initialize } = require('../../external/database/json')
const { getLogger } = require('../../infra/logger')

const getDatabasePath = () => path.resolve(__dirname, 'products.json')

const getDatabase = (
  databasePath = getDatabasePath(),
  logger = getLogger()
) => {
  try {
    const data = initialize(databasePath)

    return {
      Product: data,
    }
  } catch (error) {
    logger.error({
      message: `Error loading products database`,
      error: error.message,
    })

    return {
      Product: [],
    }
  }
}

const getProductById = async (
  id,
  database = getDatabase(),
  logger = getLogger()
) => {
  try {
    const product = database.Product.find((product) => product.id === id)

    return product ? product : null
  } catch (error) {
    logger.error({
      message: `Error finding product with id: #${id}`,
      error: error.message,
    })

    throw new Error(`Can not find product with id: #${id}`)
  }
}

const getGiftProduct = async (
  database = getDatabase(),
  logger = getLogger()
) => {
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

    throw new Error(errorMessage)
  }
}

module.exports = {
  getDatabase,
  getProductById,
  getGiftProduct,
}
