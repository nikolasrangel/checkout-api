const http = require('../../external/http')
const logger = require('../logger')
const productDatabase = require('../product-database')
const discountClient = require('../discount-client')

const healthCheckEndpointOptions = () => {
  return {
    method: 'get',
    endpoint: '/_health_check',
    handler: (request, response) => response.status(200).send('ok'),
  }
}

const getServerConfigurations = (options) => {
  const { serverDiscountAddress, databaseProductAddress, isBlackFriday } =
    options

  const { disableUnsafeHeaders, parseJSONRequests } =
    http.getServerMiddlewares()

  const database = {
    product: productDatabase.getDatabase(databaseProductAddress),
  }

  const clients = {
    discount: discountClient.createDiscountClient(serverDiscountAddress),
  }

  const healthCheckEndpoint = healthCheckEndpointOptions()

  const features = {
    isBlackFriday,
  }

  return [
    http.serverMiddlewareRegister(disableUnsafeHeaders),
    http.serverMiddlewareRegister(parseJSONRequests),
    http.serverWithDatabase(database),
    http.serverWithLogger(logger.getLogger()),
    http.serverWithClients(clients),
    http.serverEndpointRegister(healthCheckEndpoint),
    http.serverWithFeatures(features),
  ]
}

const createServer = (options) => {
  // TODO: check if options contain all server properties (ie, port number, features flags etc)

  const server = http.createServer(options)
  const serverConfigurations = getServerConfigurations(options)

  serverConfigurations.forEach((configuration) => {
    configuration(server)
  })

  return server
}

const createServerEndpoint = (server, endpoint) => {
  return http.serverEndpointRegister(endpoint)(server)
}

const closeServer = (server) => server.listener.close()

const handleServerProcessSignalEvents = (
  server,
  serverProcess,
  handleSignalEventFunction
) => {
  serverProcess.on('SIGTERM', handleSignalEventFunction(server, serverProcess))

  serverProcess.on('SIGINT', handleSignalEventFunction(server, serverProcess))
}

module.exports = {
  createServer,
  createServerEndpoint,
  closeServer,
  handleServerProcessSignalEvents,
}
