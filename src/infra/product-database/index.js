const path = require('path')

const {
  initialize: initializeJSONFile,
} = require('../../external/database/json')
const { getLogger } = require('../logger')

const getDatabase = (databasePath, logger = getLogger()) => {
  try {
    const databaseFullPath = path.resolve(__dirname, databasePath)

    const data = initializeJSONFile(databaseFullPath)

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

module.exports = {
  getDatabase,
}
