require("http")
  .createServer(async (_, res) => {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end()
  })
  .listen(3010, function () {
    console.log("Mock audit log API start at port 3010")
  })
