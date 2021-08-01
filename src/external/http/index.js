const serverBuilder = require('express')
const disableUnsafeHeadersMiddleware = require('helmet')

const createServer = (options) => {
  const { port } = options

  const server = serverBuilder()

  server.listener = server.listen(port)

  return server
}

const serverMiddlewareRegister = (middleware) => (server) => {
  server.use(middleware())

  return server
}

const serverWithLogger = (logger) => (server) => {
  server.logger = logger

  return server
}

const serverWithDatabase = (database) => (server) => {
  server.database = database

  return server
}

const serverEndpointRegister = (options) => (server) => {
  const { method, endpoint, handler } = options

  return server[method](endpoint, handler)
}

const getServerMiddlewares = () => {
  return {
    disableUnsafeHeaders: disableUnsafeHeadersMiddleware,
    parseJSONRequests: serverBuilder.json,
  }
}

const serverWithClients = (clients) => (server) => {
  server.clients = clients

  return server
}

const serverWithFeatures = (features) => (server) => {
  server.features = features

  return server
}

module.exports = {
  createServer,
  serverMiddlewareRegister,
  serverWithLogger,
  serverWithDatabase,
  serverEndpointRegister,
  getServerMiddlewares,
  serverWithClients,
  serverWithFeatures,
}
