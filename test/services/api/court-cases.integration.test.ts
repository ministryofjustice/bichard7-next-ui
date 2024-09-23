describe("GET /court-cases", () => {
  const url = "http://localhost:4080/bichard/api/court-cases"

  it("returns a 200 status code", async () => {
    const response = await fetch(url)

    expect(response.status).toBe(200)
  })
})
