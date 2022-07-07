import type { TestUser } from "../../test/testFixtures/database/manageUsers"

describe("Home", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.task("clearUsers")
      cy.clearCookies()
    })

    const users: TestUser[] = [
      {
        id: 1,
        username: "Bichard01",
        visibleForces: ["001"],
        forenames: "Bichard Test User",
        surname: "01",
        email: "bichard01@example.com"
      }
    ]

    it("should display 0 cases and the user's username when no cases are added", () => {
      cy.setAuthCookie("Bichard01")
      cy.task("insertUsers", users)
      cy.visit("/")
      cy.get("caption").should("have.text", "0 court cases for Bichard01")
    })

    it("should display a case for the user's org", () => {
      cy.setAuthCookie("Bichard01")
      cy.task("insertUsers", users)
      cy.task("insertCourtCasesWithOrgCodes", ["01"])

      cy.visit("/")
      cy.get("caption").should("have.text", "1 court cases for Bichard01")
    })
  })
})

export {}
