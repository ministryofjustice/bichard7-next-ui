import type { TestUser } from "../../test/testFixtures/database/manageUsers"

describe("Home", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.task("clearUsers")
      cy.clearCookies()
    })

    const users: TestUser[] = Array.from(Array(5)).map((_value, idx) => {
      return {
        username: `Bichard0${idx}`,
        visibleForces: [`00${idx}`],
        forenames: "Bichard Test User",
        surname: `0${idx}`,
        email: `bichard0${idx}@example.com`
      }
    })

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

    it("should only display cases visible to users forces", () => {
      cy.setAuthCookie("Bichard02")
      cy.task("insertUsers", users)
      cy.task("insertCourtCasesWithOrgCodes", ["01", "02", "03", "04"])

      cy.visit("/")
      cy.get("caption").should("have.text", "1 court cases for Bichard02")
    })

    it("should display cases for sub-forces", () => {
      cy.setAuthCookie("Bichard01")
      cy.task("insertUsers", users)
      cy.task("insertCourtCasesWithOrgCodes", ["01", "011", "012A", "013A1"])

      cy.visit("/")
      cy.get("caption").should("have.text", "4 court cases for Bichard01")
    })
  })
})

export {}
