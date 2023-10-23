require("http")
  .createServer(async (_, res) => {
    const body = JSON.stringify([
      {
        workflowId: "test workflow ID"
      }
    ])
    res.writeHead(200, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) })
    res.write(body)
    res.end()
  })
  .listen(5002, () => console.log("Running conductor fake on port 5002"))
