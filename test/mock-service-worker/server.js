const { setupServer } = require("msw/node")
const conductor = require("./conductor")

// modules export arrays of handlers
const handlers = [...conductor]
module.exports = { server: setupServer(...handlers) }
