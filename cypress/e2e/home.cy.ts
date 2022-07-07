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
      cy.task("insertUsers", users)
      cy.setAuthCookie("Bichard01")

      cy.visit("/")
      cy.get("caption").should("have.text", "0 court cases for Bichard01")
    })

    it("should display a case for the user's org", () => {
      cy.task("insertUsers", users)
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      cy.setAuthCookie("Bichard01")

      cy.visit("/")
      cy.get("caption").should("have.text", "1 court cases for Bichard01")
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
    })

    it("should only display cases visible to users forces", () => {
      cy.task("insertUsers", users)
      cy.task("insertCourtCasesWithOrgCodes", ["01", "02", "03", "04"])
      cy.setAuthCookie("Bichard02")

      cy.visit("/")
      cy.get("caption").should("have.text", "1 court cases for Bichard02")
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)
    })

    it("should display cases for sub-forces", () => {
      cy.task("insertUsers", users)
      cy.task("insertCourtCasesWithOrgCodes", ["01", "011", "012A", "013A1"])
      cy.setAuthCookie("Bichard01")

      cy.visit("/")
      cy.get("caption").should("have.text", "4 court cases for Bichard01")
      cy.get("tr")
        .not(":first")
        .each((row, index) => {
          cy.wrap(row).get("td:nth-child(2)").contains(`Case0000${index}`)
      })
    })

    it("should display cases for parent forces up to the second-level force", () => {
      cy.task("insertUsers", [
        {
          username: "Bichard01",
          visibleForces: ["0011111"],
          forenames: "Bichard Test User",
          surname: "01",
          email: "bichard01@example.com"
        }
      ])
      cy.task("insertCourtCasesWithOrgCodes", ["01", "011", "0111", "01111", "011111"])
      cy.setAuthCookie("Bichard01")

      cy.visit("/")
      cy.get("caption").should("have.text", "3 court cases for Bichard01")
      cy.get("tr")
        .not(":first")
        .each((row, index) => {
          cy.wrap(row)
            .get("td:nth-child(2)")
            .contains(`Case0000${index + 2}`)
        })
    })
  })
})

export {}
