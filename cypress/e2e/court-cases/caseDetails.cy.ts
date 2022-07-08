import type { TestUser } from "../../../test/testFixtures/database/manageUsers"

describe("Home", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.task("clearUsers")
      cy.setAuthCookie("Bichard01")
      cy.viewport(1280, 720)
    })

    const users: TestUser[] = Array.from(Array(5)).map((_value, idx) => {
      return {
        username: `Bichard0${idx}`,
        visibleForces: [`0${idx}`],
        forenames: "Bichard Test User",
        surname: `0${idx}`,
        email: `bichard0${idx}@example.com`
      }
    })

    // it("should load case details for the case that this user can see", () => {

    // })

    // it("should return 404 for the case that this user can not see", () => {

    // })

    it("should return 404 for the case that does not exist", () => {
      cy.task("insertUsers", users)
      cy.setAuthCookie("Bichard01")

      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/1"
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

    it.skip("should return 401 if auth token is invalid", () => {
      cy.clearCookies()
      cy.setAuthCookie("InvalidUser")

      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/1"
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  })
})

export {}
