const path = require('path')
const { equals } = require('ramda')

const grpcClient = require('../grpc/index')

const defaultClientOptions = {
  packageName: 'discount',
  serviceName: 'Discount',
  protoFileName: 'discount',
}

const createDiscountClient = (
  serverDiscountAddress,
  options = defaultClientOptions
) => {
  if (!serverDiscountAddress || typeof serverDiscountAddress !== 'string') {
    throw new Error('Server discount address argument must be a string')
  }

  if (
    !options ||
    typeof options !== 'object' ||
    !equals(Object.keys(options), [
      'packageName',
      'serviceName',
      'protoFileName',
    ])
  ) {
    throw new Error(
      'Argument "options" must be an object with the following properties: packageName, serviceName, protoFileName'
    )
  }

  const protoFileAbsolutepath = path.resolve(
    __dirname,
    `./proto/${options.protoFileName}.proto`
  )
  const packageDefinition = grpcClient.loadPackageDefinition(
    protoFileAbsolutepath
  )

  return grpcClient.createClient(
    {
      packageDefinition,
      packageName: options.packageName,
      serviceName: options.serviceName,
    },
    serverDiscountAddress
  )
}

const getProductPercentageDiscount = async (client, id) => {
  return new Promise((resolve, reject) =>
    client.getDiscount({ productID: id }, (error, response) => {
      if (error) {
        return reject(error)
      }

      const percentage = response.percentage
        ? Number(response.percentage)
        : reject(
            new Error(
              'Discount server response does not contain percentage property'
            )
          )

      return resolve(percentage)
    })
  )
}

module.exports = {
  defaultClientOptions,
  createDiscountClient,
  getProductPercentageDiscount,
}
