import type { TestTrigger } from "../../../../test/util/manageTriggers"
import User from "services/entities/User"
import a11yConfig from "../../../support/a11yConfig"
import logAccessibilityViolations from "../../../support/logAccessibilityViolations"

describe("Home", () => {
  context("720p resolution", async () => {
    const users: Partial<User>[] = await Promise.all(
      Array.from(Array(5)).map(async (_value, idx) => {
        return {
          username: `Bichard0${idx}`,
          visibleForces: [`0${idx}`],
          forenames: "Bichard Test User",
          surname: `0${idx}`,
          email: `bichard0${idx}@example.com`
        }
      })
    )

    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.task("clearUsers")
      cy.task("insertUsers", users)
      cy.clearCookies()
      cy.login("bichard01@example.com", "password")
      cy.viewport(1280, 720)
    })

    it("should be accessible", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })
      cy.visit("/court-cases/0")
      cy.get("button").contains("Add Note").click()

      cy.injectAxe()

      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })

    it("should be able to add a note when case is visible to the user and not locked by another user", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })
      cy.visit("/court-cases/0")
      cy.get("button").contains("Add Note").click()
      cy.get("H2").should("have.text", "Add Note")
      cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0")

      cy.get("textarea").type("Dummy note")
      cy.get("button").contains("Add").click()

      cy.get("H2").should("have.text", "Case Details")
      const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
      cy.get("table").eq(-1).find("tr").eq(0).find("td").first().contains(dateTimeRegex)
      cy.get("table").eq(-1).find("tr").eq(0).find("td").last().should("have.text", "Dummy note")
    })

    it("should be able to add a long note", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })
      cy.visit("/court-cases/0")
      cy.get("button").contains("Add Note").click()
      cy.get("H2").should("have.text", "Add Note")
      cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0")

      cy.get("textarea").type("A ".repeat(500) + "B ".repeat(500) + "C ".repeat(100), { delay: 0 })
      cy.get("button").contains("Add").click()

      cy.get("H2").should("have.text", "Case Details")
      const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
      cy.get("table").eq(-1).find("tr").eq(0).find("td").first().contains(dateTimeRegex)
      cy.get("table").eq(-1).find("tr").eq(0).find("td").last().should("have.text", "A ".repeat(500))
      cy.get("table").eq(-1).find("tr").eq(1).find("td").first().contains(dateTimeRegex)
      cy.get("table").eq(-1).find("tr").eq(1).find("td").last().should("have.text", "B ".repeat(500))
      cy.get("table").eq(-1).find("tr").eq(2).find("td").first().contains(dateTimeRegex)
      cy.get("table").eq(-1).find("tr").eq(2).find("td").last().should("have.text", "C ".repeat(100))
    })

    it("should show error message when note text is empty", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })
      cy.visit("/court-cases/0")
      cy.get("button").contains("Add Note").click()
      cy.get("H2").should("have.text", "Add Note")
      cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0")

      cy.get("button").contains("Add").click()

      cy.url().should("match", /.*\/court-cases\/0\/notes\/add\?#/)
      cy.get("H2").should("have.text", "Add Note")
      cy.get("SPAN").eq(3).should("have.text", "Required")
    })

    it("Adding an empty note doesn't add a note, when the case is visible to the user and not locked by another user", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })
      cy.visit("/court-cases/0")
      cy.get("button").contains("Add Note").click()
      cy.get("H2").should("have.text", "Add Note")

      cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0").click()

      cy.url().should("match", /.*\/court-cases\/0/)
      cy.get("H2").should("have.text", "Case Details")
      cy.findByText("Case has no notes.").should("exist")
    })

    it("should return 404 for a case that this user can not see", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["02"])

      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/0/notes/add"
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

    it("should return 404 for a case that does not exist", () => {
      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/1/notes/add"
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

    it("should return 401 if the auth token provided is for a non-existent user", () => {
      cy.clearCookies()
      // cy.setAuthCookie("InvalidUser")

      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/1/notes/add"
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  })
})

export {}
