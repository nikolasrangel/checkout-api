const grpc = require('@grpc/grpc-js')
const grpcProtoLoader = require('@grpc/proto-loader')
const path = require('path')
const { equals } = require('ramda')

const loadPackageDefinition = (protoPath, protoLoader = grpcProtoLoader) => {
  if (!protoPath || typeof protoPath !== 'string') {
    throw new Error('Argument "protoPath" must be a string')
  }

  const protoAbsolutePath = path.resolve(__dirname, protoPath)

  return protoLoader.loadSync(protoAbsolutePath)
}

const loadPackgeObject = (packageDefinition, grpcClient = grpc) => {
  if (!packageDefinition || typeof packageDefinition !== 'object') {
    throw new Error('Argument "packageDefinition" must be an object')
  }

  return grpcClient.loadPackageDefinition(packageDefinition)
}

const createClient = (options, grpcServerAddress) => {
  if (
    !options ||
    typeof options !== 'object' ||
    !equals(Object.keys(options), [
      'packageDefinition',
      'packageName',
      'serviceName',
    ])
  ) {
    throw new Error(
      'Argument "options" must be an object with the following properties: packageDefinition, packageName, serviceName'
    )
  }

  if (!grpcServerAddress || typeof grpcServerAddress !== 'string') {
    throw new Error('gRPC server address argument must be a string')
  }

  const { packageDefinition, packageName, serviceName } = options

  const packageObject = loadPackgeObject(packageDefinition)

  return new packageObject[packageName][serviceName](
    grpcServerAddress,
    grpc.credentials.createInsecure()
  )
}

const closeClient = (client) => client.close()

module.exports = {
  closeClient,
  createClient,
  loadPackageDefinition,
  loadPackgeObject,
}
