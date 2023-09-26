async function init() {
  const { server } = await import("./server")
  server.listen()
}

init()

export {}
