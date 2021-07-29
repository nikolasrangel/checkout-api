const logger = require('pino')

const defaultOptions = () => ({
  messageKey: 'message',
  formatters: {
    level: (label) => {
      return { level: label }
    },
  },
})

const getLogger = () => logger(defaultOptions())

module.exports = {
  getLogger,
}
