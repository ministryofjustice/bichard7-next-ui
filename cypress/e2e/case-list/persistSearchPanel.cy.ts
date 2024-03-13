import { ResolutionStatus } from "types/ResolutionStatus"
import { defaultSetup, loginAndGoToUrl } from "../../support/helpers"

const caseTriggers: { code: string; status: ResolutionStatus }[][] = [
  [
    {
      code: "TRPR0001",
      status: "Unresolved"
    }
  ]
]

before(() => {
  defaultSetup()
})

beforeEach(() => {
  cy.task("clearCourtCases")
})

it("Should show search panel by default after logging in", () => {
  loginAndGoToUrl()

  cy.contains("Apply filters")
})

it("When the user refreshes the page, the search panel should stay closed", () => {
  loginAndGoToUrl()
  cy.get("#filter-button").contains("Hide search panel").click()
  cy.get("#filter-button").contains("Show search panel")

  cy.visit("/bichard")
  cy.get("#filter-button").contains("Show search panel")
})

it("When the user applies a filter, the search panel should stay open", () => {
  cy.task("insertDummyCourtCasesWithTriggers", {
    caseTriggers,
    orgCode: "01",
    triggersLockedByUsername: "Bichard01"
  })

  loginAndGoToUrl()

  cy.contains("Exceptions").click()
  cy.get("button[id=search]").click()
  cy.get("#filter-button").contains("Hide search panel")
})

it("The filter panel state should reset to its default after one week from its initial activation", () => {
  loginAndGoToUrl()

  cy.get("#filter-button").contains("Hide search panel").click()
  cy.get("#filter-button").contains("Show search panel")

  // Advance time by a week
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() - 7)
  cy.window().then((win) => {
    win.localStorage.setItem("is-filter-panel-visible-Bichard01", currentDate.toISOString())
  })
  cy.visit("/bichard")
  cy.get("#filter-button").contains("Hide search panel")
})
