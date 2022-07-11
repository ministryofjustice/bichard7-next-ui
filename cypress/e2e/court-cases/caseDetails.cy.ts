import type { TestUser } from "../../../test/testFixtures/database/manageUsers"
import type { TestTrigger } from "../../../test/testFixtures/database/manageTriggers"

describe("Home", () => {
  context("720p resolution", () => {
    const users: TestUser[] = Array.from(Array(5)).map((_value, idx) => {
      return {
        username: `Bichard0${idx}`,
        visibleForces: [`0${idx}`],
        forenames: "Bichard Test User",
        surname: `0${idx}`,
        email: `bichard0${idx}@example.com`
      }
    })

    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.task("clearUsers")
      cy.task("insertUsers", users)
      cy.clearCookies()
      cy.setAuthCookie("Bichard01")
      cy.viewport(1280, 720)
    })

    it.only("should load case details for the case that this user can see", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: 0,
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })
      cy.visit("/court-cases/0")

      cy.get("H2").should("have.text", "Case Details")
      cy.get("tr").contains("Case00000")
      cy.get("tr").contains("Magistrates' Courts Essex Basildon")
      cy.get("tr").should("contain.text", "26/09/2008 01:00:00")
      cy.get("tr").contains("Allocation Trigger")
      cy.get("tr").contains("HO100206")
      cy.get("tr").contains("TRPR0006")
      cy.get("H3").contains("Triggers")
      cy.get("H3").contains("Notes")
      cy.get("tr").contains("TRPR0001")
      cy.get("tr").should("contain.text", "09/07/2022 11:22:34")
      cy.get("p").contains("Case has no notes.")
    })

    it("should return 404 for a case that this user can not see", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["02"])

      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/0"
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

    it("should return 404 for a case that does not exist", () => {
      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/1"
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

    it("should return 401 if the auth token provided is for a non-existent user", () => {
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
