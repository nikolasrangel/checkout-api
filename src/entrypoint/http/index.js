const { mergeRight } = require('ramda')

const http = require('../../infra/server-http')
const { createCheckoutEndpoint } = require('./endpoints')

const getServerOptions = (serverProcess) => {
  const {
    DISCOUNT_SERVER_ADDRESS: serverDiscountAddress,
    PRODUCT_DATABASE_ADDRESS: databaseProductAddress,
    SERVER_HTTP_PORT_NUMBER: serverHttpPort,
    IS_BLACK_FRIDAY: isBlackFriday,
  } = serverProcess.env

  return {
    serverDiscountAddress: serverDiscountAddress,
    databaseProductAddress: databaseProductAddress,
    port: serverHttpPort,
    isBlackFriday: Boolean(isBlackFriday),
  }
}

const createServerEndpoints = (server) => {
  const checkoutEndpoint = createCheckoutEndpoint(server)
  http.createServerEndpoint(server, checkoutEndpoint)

  return server
}

const closeServer = (server) => http.closeServer(server)

const handleSignalEvents = (server, serverProcess) => (signal) => {
  const { logger } = server

  logger.fatal({
    message: `Received a ${signal} signal. Shutting down HTTP server`,
  })

  http.closeServer(server)

  serverProcess.exit(1)
}

const createServer = (options) => {
  const serverOptions = mergeRight(getServerOptions(process), options)

  const server = http.createServer(serverOptions)

  createServerEndpoints(server)

  http.handleServerProcessSignalEvents(server, process, handleSignalEvents)

  return server
}

module.exports = {
  createServer,
  closeServer,
  handleSignalEvents,
}
