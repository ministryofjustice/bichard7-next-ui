import type { TestTrigger } from "../../../../test/utils/manageTriggers"
import User from "services/entities/User"
import a11yConfig from "../../../support/a11yConfig"
import logAccessibilityViolations from "../../../support/logAccessibilityViolations"
import hashedPassword from "../../../fixtures/hashedPassword"
import { loginAndGoToUrl } from "../../index.cy"

const loginAndGoToNotes = () => {
  loginAndGoToUrl("bichard01@example.com", "/bichard/court-cases/0")
  cy.contains("Notes").click()
}

const insertTriggers = () => {
  cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
  const triggers: TestTrigger[] = [
    {
      triggerId: 0,
      triggerCode: "TRPR0001",
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }
  ]
  cy.task("insertTriggers", { caseId: 0, triggers })
}

describe("Case details", () => {
  const users: Partial<User>[] = Array.from(Array(5)).map((_value, idx) => {
    return {
      username: `Bichard0${idx}`,
      visibleForces: [`0${idx}`],
      forenames: "Bichard Test User",
      surname: `0${idx}`,
      email: `bichard0${idx}@example.com`,
      password: hashedPassword
    }
  })

  before(() => {
    cy.task("clearUsers")
    cy.task("insertUsers", { users, userGroups: ["B7NewUI_grp"] })
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("should be accessible", () => {
    insertTriggers()

    loginAndGoToNotes()
    cy.get("button").contains("Add Note").click()

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it.only("should be able to add a note when case is visible to the user and not locked by another user", () => {
    insertTriggers()

    loginAndGoToNotes()
    cy.get("button").contains("Add Note").click()
    cy.get("H1").should("have.text", "Add Note")
    cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get("textarea").type("Dummy note")
    cy.get("button").contains("Add").click()

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Dummy note")
  })

  it("should be able to add a long note", () => {
    insertTriggers()
    loginAndGoToNotes()
    cy.get("button").contains("Add Note").click()
    cy.get("H1").should("have.text", "Add Note")
    cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get("textarea").type("A ".repeat(500) + "B ".repeat(500) + "C ".repeat(100), { delay: 0 })
    cy.get("button").contains("Add").click()

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    cy.contains("A ".repeat(500))
    cy.contains("B ".repeat(500))
    cy.contains("C ".repeat(100))
  })

  it("should show error message when note text is empty", () => {
    insertTriggers()
    loginAndGoToNotes()
    cy.get("button").contains("Add Note").click()
    cy.get("H1").should("have.text", "Add Note")
    cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get("button").contains("Add").click()

    cy.url().should("match", /.*\/court-cases\/0\/notes\/add\?#/)
    cy.get("H1").should("have.text", "Add Note")
    cy.get("span").eq(2).should("have.text", "Required")
  })

  it("Adding an empty note doesn't add a note, when the case is visible to the user and not locked by another user", () => {
    insertTriggers()
    loginAndGoToNotes()
    cy.get("button").contains("Add Note").click()
    cy.get("H1").should("have.text", "Add Note")

    cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0").click()

    cy.url().should("match", /.*\/court-cases\/0/)
    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    cy.findByText("Case has no notes.").should("exist")
  })

  it("should return 404 for a case that this user can not see", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "02" }])
    cy.login("bichard01@example.com", "password")

    cy.request({
      failOnStatusCode: false,
      url: "/bichard/court-cases/0/notes/add"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("should return 404 for a case that does not exist", () => {
    cy.login("bichard01@example.com", "password")

    cy.request({
      failOnStatusCode: false,
      url: "/court-cases/1/notes/add"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })
})

export {}
