import { withAuthentication } from "middleware"

jest.mock("../../src/middleware/withAuthentication/withAuthentication")
// audit logging tests can't be done in cypress
// because you can't mock the calls

// currentUser, query, req
;(withAuthentication as jest.Mock).mockImplementation(() => ({
  context: {},
  currentUser: {}
}))

describe("Manual resolution", () => {
  describe("if the transaction doesn't fail", () => {
    it("should raise events exceptions.resolved and exceptions.unlocked", () => {})
  })

  describe("roll back if resolution fails", () => {
    it("should raise no events", () => {})
  })
  describe("roll back if audit logging fails", () => {
    it("should raise no events", () => {})
  })
  describe("roll back if unlock fails", () => {
    it("should raise no events", () => {})
  })
})
