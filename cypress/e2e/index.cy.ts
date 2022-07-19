import type { TestUser } from "../../test/testFixtures/database/manageUsers"

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

    it("should display 0 cases and the user's username when no cases are added", () => {
      cy.task("insertUsers", users)

      cy.visit("/")
    })

    it("should display a case for the user's org", () => {
      cy.task("insertUsers", users)
      cy.task("insertCourtCasesWithOrgCodes", ["01"])

      cy.visit("/")
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
    })

    it("should only display cases visible to users forces", () => {
      cy.task("insertUsers", users)
      cy.task("insertCourtCasesWithOrgCodes", ["01", "02", "03", "04"])
      cy.setAuthCookie("Bichard02")

      cy.visit("/")
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)
    })

    it("should display cases for sub-forces", () => {
      cy.task("insertUsers", users)
      cy.task("insertCourtCasesWithOrgCodes", ["01", "011", "012A", "013A1"])

      cy.visit("/")
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
          visibleForces: ["011111"],
          forenames: "Bichard Test User",
          surname: "01",
          email: "bichard01@example.com"
        }
      ])
      cy.task("insertCourtCasesWithOrgCodes", ["01", "011", "0111", "01111", "011111"])

      cy.visit("/")
      cy.get("tr")
        .not(":first")
        .each((row, index) => {
          cy.wrap(row)
            .get("td:nth-child(2)")
            .contains(`Case0000${index + 2}`)
        })
    })

    it("can display cases ordered by court name", () => {
      cy.task("insertUsers", [
        {
          username: "Bichard01",
          visibleForces: ["011111"],
          forenames: "Bichard Test User",
          surname: "01",
          email: "bichard01@example.com"
        }
      ])
      cy.task("insertCourtCasesWithCourtNames", { courtNames: ["BBBB", "AAAA", "DDDD", "CCCC"], force: "011111" })

      cy.visit("/")

      cy.get("[id^=court-name]").click()

      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).get("td:nth-child(4)").first().contains("AAAA")
          cy.wrap(row).get("td:nth-child(4)").last().contains("DDDD")
        })

      cy.get("[id^=court-name]").click()

      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).get("td:nth-child(4)").first().contains("DDDD")
          cy.wrap(row).get("td:nth-child(4)").last().contains("AAAA")
        })
    })

    it.only("can display cases filtered by defendant name", () => {
      cy.task("insertUsers", [
        {
          username: "Bichard01",
          visibleForces: ["011111"],
          forenames: "Bichard Test User",
          surname: "01",
          email: "bichard01@example.com"
        }
      ])
      cy.task("insertCourtCasesWithDefendantNames", {
        defendantNames: ["Bruce Wayne", "Barbara Gordon", "Alfred Pennyworth"],
        force: "011111"
      })

      cy.visit("/")

      cy.get("[id^=search-defendant-name]").type("Bruce Wayne")

      cy.get("#search_button_homepage").click()

      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).get("td:nth-child(3)").first().contains("Bruce Wayne")
        })
    })
  })
})

export {}
