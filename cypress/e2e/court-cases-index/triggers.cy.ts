import { defaultSetup, loginAndGoToUrl } from "../../support/helpers"

// Unresolved and user has permission to see them (e.g. not Exception Handlers)
describe("When I can see triggers on cases", () => {
  const makeTriggers = (code?: number, count = 5) =>
    Array.from(Array(count ?? 5)).map((_, idx) => {
      return {
        triggerId: idx,
        triggerCode: `TRPR000${code ?? idx + 1}`,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    })

  before(() => {
    defaultSetup()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should display individual triggers without a count", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    cy.task("insertTriggers", { caseId: 0, triggers: makeTriggers() })
    loginAndGoToUrl()

    cy.get(".trigger-description")
      .contains(/\(\d+\)/) // any number between parentheses
      .should("not.exist")
  })

  it("Should group duplicate triggers", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    cy.task("insertTriggers", { caseId: 0, triggers: makeTriggers(1) })
    loginAndGoToUrl()

    cy.get("table").find(".trigger-description").should("have.length", 1)
  })

  it("Should include a count for grouped triggers", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    cy.task("insertTriggers", { caseId: 0, triggers: makeTriggers(2) })
    loginAndGoToUrl()

    cy.get(".trigger-description")
      .contains(/\(\d+\)/) // any number between parentheses
      .should("exist")
  })

  it("Should display individual and grouped triggers together", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const triggers = [...makeTriggers(), ...makeTriggers(1)].map((t, i) => {
      t.triggerId = i
      return t
    })

    cy.task("insertTriggers", { caseId: 0, triggers })
    loginAndGoToUrl()

    cy.get(".trigger-description:contains('TRPR0001')")
      .contains(/\(\d+\)/) // any number between parentheses
      .should("exist")

    cy.get(".trigger-description:not(:contains('TRPR0001'))")
      .contains(/\(\d+\)/)
      .should("not.exist")
  })

  it("Should display the correct count for grouped triggers", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const triggers = makeTriggers(1, 12)
    cy.task("insertTriggers", { caseId: 0, triggers })
    loginAndGoToUrl()

    cy.get(".trigger-description:contains('TRPR0001')")
      .contains(/\(\d+\)/) // any number between parentheses
      .should("include.text", "(12)")
  })
})
