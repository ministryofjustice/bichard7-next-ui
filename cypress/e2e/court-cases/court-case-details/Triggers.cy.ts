import type { TestTrigger } from "../../../../test/utils/manageTriggers"
import hashedPassword from "../../../fixtures/hashedPassword"

const caseURL = "/bichard/court-cases/0"

const unresolvedTriggers: TestTrigger[] = Array.from(Array(5)).map((_, idx) => {
  return {
    triggerId: idx,
    triggerCode: `TRPR000${idx + 1}`,
    status: "Unresolved",
    createdAt: new Date("2022-07-09T10:22:34.000Z")
  }
})
const unresolvedTrigger = unresolvedTriggers[0]
const resolvedTriggers: TestTrigger[] = Array.from(Array(5)).map((_, idx) => {
  const triggerId = unresolvedTriggers.length + idx
  return {
    triggerId,
    triggerCode: `TRPR000${idx + 1}`,
    status: "Resolved",
    createdAt: new Date("2022-07-09T10:22:34.000Z")
  }
})
const resolvedTrigger = resolvedTriggers[0]
const mixedTriggers = [...resolvedTriggers, ...unresolvedTriggers]

describe("Triggers", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.task("clearUsers")
    cy.task("insertUsers", {
      users: [
        {
          username: "Bichard01",
          visibleForces: ["01"],
          forenames: "Bichard Test User",
          surname: "01",
          email: "bichard01@example.com",
          password: hashedPassword
        }
      ],
      userGroups: ["B7NewUI_grp"]
    })
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    ])
  })

  beforeEach(() => {
    cy.login("bichard01@example.com", "password")
    cy.task("clearTriggers")
  })

  describe("Trigger status", () => {
    it("should display a message and no button when there are no triggers on the case", () => {
      cy.visit(caseURL)
      cy.get(".moj-tab-panel-triggers").should("contain.text", "There are no triggers for this case.")
      cy.get("#mark-triggers-complete-button").should("not.exist")
    })

    it("should show a complete badge against each resolved trigger", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: resolvedTriggers })

      cy.visit(caseURL)

      cy.get(".moj-tab-panel-triggers").should("be.visible")
      cy.get(".moj-tab-panel-exceptions").should("not.be.visible")

      cy.get(".moj-trigger-row").each((trigger) => {
        cy.wrap(trigger).get(".trigger-header").contains("Complete").should("exist")
      })
    })
  })

  describe("Mark as complete button", () => {
    it("should be disabled if all triggers are resolved", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: [unresolvedTrigger] })

      cy.visit(caseURL)
      cy.get(".moj-tab-panel-triggers").should("be.visible")

      cy.get("#mark-triggers-complete-button").should("be.visible").should("have.attr", "disabled")
    })

    it("should be disabled if no triggers are selected", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: [unresolvedTrigger] })

      cy.visit(caseURL)

      cy.get(".trigger-header input:checkbox").should("not.be.checked")
      cy.get("#mark-triggers-complete-button").should("exist").should("have.attr", "disabled")
    })

    it("should be enabled when one or more triggers is selected", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })

      cy.visit(caseURL)

      // Clicks all checkboxes
      cy.get(".trigger-header input:checkbox").click({ multiple: true })
      cy.get("#mark-triggers-complete-button").should("exist").should("not.have.attr", "disabled")

      // Uncheck one checkbox
      cy.get(".trigger-header input:checkbox").eq(0).click()
      cy.get("#mark-triggers-complete-button").should("exist").should("not.have.attr", "disabled")
    })

    it("should be disabled when all the triggers are deselected", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })

      cy.visit(caseURL)

      // Clicks all checkboxes
      cy.get(".trigger-header input:checkbox").click({ multiple: true })
      cy.get("#mark-triggers-complete-button").should("exist").should("not.have.attr", "disabled")

      // Uncheck all checkbox
      cy.get(".trigger-header input:checkbox").click({ multiple: true })
      cy.get("#mark-triggers-complete-button").should("exist").should("have.attr", "disabled")
    })
  })

  describe("Select all", () => {
    it("should be visible if there are multiple unresolved triggers", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
      cy.visit(caseURL)
      cy.get("#select-all-triggers").should("be.visible")
    })

    it("should be hidden if all triggers are resolved", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: resolvedTriggers })
      cy.visit(caseURL)
      cy.get("#select-all-triggers").should("not.be.visible")
    })

    it("should be visible if there is a single unresolved trigger", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: [unresolvedTrigger] })
      cy.visit(caseURL)
      cy.get("#select-all-triggers").should("be.visible")
    })

    it("should be hidden if there is a single resolved trigger", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: [resolvedTrigger] })
      cy.visit(caseURL)
      cy.get("#select-all-triggers").should("not.be.visible")
    })

    it("should be visible if there is a mix of resolved and unresolved triggers", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: mixedTriggers })
      cy.visit(caseURL)
      cy.get("#select-all-triggers").should("be.visible")
    })

    it("should select all triggers when pressed if there are only unresolved triggers", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
      cy.visit(caseURL)
      cy.get(".trigger-header input[type='checkbox']").should("not.be.checked")
      cy.get("#select-all-triggers button").click()
      cy.get(".trigger-header input[type='checkbox']").should("be.checked")
    })

    it("should select all triggers when pressed if there is a mix of resolved and unresolved triggers", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: mixedTriggers })
      cy.visit(caseURL)
      cy.get("#select-all-triggers button").click()
      cy.get(".trigger-header input[type='checkbox']").should("be.checked")
    })
  })
})
