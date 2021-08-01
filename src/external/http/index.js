const serverBuilder = require('express')

const createServer = (options) => {
  const { port } = options

  const server = serverBuilder()

  server.listen(port)

  return server
}

const serverMiddlewareRegister = (server, middleware) => {
  server.use(middleware)

  return server
}

const serverWithLogger = (server, logger) => {
  server.logger = logger

  return server
}

const serverWithDatabase = (server, database) => {
  server.database = database

  return server
}

const serverEndpointRegister = (server, options) => {
  const { method, endpoint, handler } = options

  return server[method](endpoint, handler)
}

module.exports = {
  createServer,
  serverMiddlewareRegister,
  serverWithLogger,
  serverWithDatabase,
  serverEndpointRegister,
}
