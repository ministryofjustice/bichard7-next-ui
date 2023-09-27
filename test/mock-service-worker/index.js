async function init() {
  // eslint-disable-next-line global-require
  const { server } = await require("./server")
  server.listen({
    onUnhandledRequest: "bypass"
  })
}

init()

module.exports = {}
