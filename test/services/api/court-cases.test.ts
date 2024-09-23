import { NextApiRequest, NextApiResponse } from "next"
import handler from "../../../src/pages/api/court-cases"

describe("GET /court-cases", () => {
  it("returns a 200 status code", async () => {
    const req = { method: "GET" } as NextApiRequest
    const res = {
      statusCode: 0,
      status: function (statusCode) {
        this.statusCode = statusCode
        return this
      },
      end: () => {}
    } as NextApiResponse

    await handler(req, res)

    expect(res.statusCode).toBe(200)
  })
})
