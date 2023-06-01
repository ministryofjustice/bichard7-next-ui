import type { TestTrigger } from "../../../../test/utils/manageTriggers"
import hashedPassword from "../../../fixtures/hashedPassword"

const caseURL = "/bichard/court-cases/0"

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
  })

  describe("Trigger status", () => {
    it("should display a message and no button when there are no triggers on the case", () => {
      cy.visit(caseURL)
      cy.get(".moj-tab-panel-triggers").should("contain.text", "There are no triggers for this case.")
      cy.get("#mark-triggers-complete-button").should("not.exist")
    })

    it("should show a complete badge against each resolved trigger", () => {
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0010",
          status: "Resolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z"),
          resolvedAt: new Date("2022-07-09T12:22:34.000Z"),
          resolvedBy: "Bichard01"
        },
        {
          triggerId: 1,
          triggerCode: "TRPR0015",
          status: "Resolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z"),
          resolvedAt: new Date("2022-07-09T12:22:34.000Z"),
          resolvedBy: "Bichard01"
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })

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
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0010",
          status: "Resolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z"),
          resolvedAt: new Date("2022-07-09T12:22:34.000Z"),
          resolvedBy: "Bichard01"
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })

      cy.visit(caseURL)
      cy.get(".moj-tab-panel-triggers").should("be.visible")

      cy.get("#mark-triggers-complete-button").should("be.visible").should("have.attr", "disabled")
    })

    it("should be disabled if no triggers are selected", () => {
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0010",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })

      cy.visit(caseURL)

      cy.get(".trigger-header input:checkbox").should("not.be.checked")
      cy.get("#mark-triggers-complete-button").should("exist").should("have.attr", "disabled")
    })

    it("should be enabled if one or more triggers is selected", () => {
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0010",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        },
        {
          triggerId: 1,
          triggerCode: "TRPR0010",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })

      cy.visit(caseURL)

      // Clicks all checkboxes
      cy.get(".trigger-header input:checkbox").click({ multiple: true })
      cy.get("#mark-triggers-complete-button").should("exist").should("not.have.attr", "disabled")

      // Uncheck one checkbox
      cy.get(".trigger-header input:checkbox").eq(0).click()
      cy.get("#mark-triggers-complete-button").should("exist").should("not.have.attr", "disabled")
    })
  })
})
