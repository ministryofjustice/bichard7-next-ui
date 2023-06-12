import { ResolutionStatus } from "types/ResolutionStatus"
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
  })

  beforeEach(() => {
    cy.login("bichard01@example.com", "password")
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    ])
  })

  describe("Trigger status", () => {
    it("should display a message and no button when there are no triggers on the case", () => {
      cy.visit(caseURL)
      cy.get(".moj-tab-panel-triggers").should("contain.text", "There are no triggers for this case.")
      cy.get("#mark-triggers-complete-button").should("not.exist")
    })

    it("should show a complete badge against each resolved trigger when the trigger lock is held", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: resolvedTriggers })

      cy.visit(caseURL)

      cy.get(".moj-tab-panel-triggers").should("be.visible")
      cy.get(".moj-tab-panel-exceptions").should("not.be.visible")

      cy.get(".moj-trigger-row").each((trigger) => {
        cy.wrap(trigger).get(".trigger-header").contains("Complete").should("exist")
      })
    })

    it("should show a complete badge against each resolved trigger when the trigger lock is not held", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          triggerLockedByUsername: "anotherUser",
          orgForPoliceFilter: "01"
        }
      ])
      cy.task("insertTriggers", { caseId: 0, triggers: resolvedTriggers })

      cy.visit(caseURL)

      cy.get(".moj-tab-panel-triggers").should("be.visible")
      cy.get(".moj-tab-panel-exceptions").should("not.be.visible")

      cy.get(".moj-trigger-row").each((trigger) => {
        cy.wrap(trigger).get(".trigger-header").contains("Complete").should("exist")
      })
    })

    it("should not show checkboxes if somebody else has the triggers locked", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          triggerLockedByUsername: "anotherUser",
          orgForPoliceFilter: "01"
        }
      ])
      cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
      cy.visit(caseURL)
      cy.get(".trigger-header input[type='checkbox']").should("not.exist")
      cy.get(".trigger-header input[type='checkbox']").should("not.exist")
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

    it("should not be present when somebody else has the trigger lock", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: "AnotherUser",
          orgForPoliceFilter: "01"
        }
      ])
      cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
      cy.visit(caseURL)
      cy.get("#mark-triggers-complete-button").should("not.exist")
    })
  })

  describe("Locked icon", () => {
    it("should be shown if somebody else has the triggers locked", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          triggerLockedByUsername: "anotherUser",
          orgForPoliceFilter: "01"
        }
      ])
      cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
      cy.visit(caseURL)
      cy.get("#triggers-locked-tag").should("exist")
    })

    it("should not be shown if the visiting user holds the trigger lock", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
      cy.visit(caseURL)
      cy.get("#triggers-locked-tag").should("not.exist")
    })

    it("should display a lock icon when someone else has the triggers locked", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          triggerLockedByUsername: "anotherUser",
          orgForPoliceFilter: "01"
        }
      ])
      cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
      cy.visit(caseURL)
      cy.get("#triggers-locked-tag img").should("exist")
    })

    it("should display the lock holders username when someone else has the triggers locked", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          triggerLockedByUsername: "anotherUser",
          orgForPoliceFilter: "01"
        }
      ])
      cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
      cy.visit(caseURL)
      cy.get("#triggers-locked-tag #triggers-locked-tag-lockee").should("contain.text", "anotherUser")
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
      cy.get("#select-all-triggers").should("not.exist")
    })

    it("should be visible if there is a single unresolved trigger", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: [unresolvedTrigger] })
      cy.visit(caseURL)
      cy.get("#select-all-triggers").should("be.visible")
    })

    it("should be hidden if there is a single resolved trigger", () => {
      cy.task("insertTriggers", { caseId: 0, triggers: [resolvedTrigger] })
      cy.visit(caseURL)
      cy.get("#select-all-triggers").should("not.exist")
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

    it("should be hidden if someone else has the triggers locked", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          triggerLockedByUsername: "anotherUser",
          orgForPoliceFilter: "01"
        }
      ])
      cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
      cy.visit(caseURL)
      cy.get("#select-all-triggers").should("not.exist")
    })
  })

  describe("Resolve triggers", () => {
    it("should be able to resolve a trigger", () => {
      const caseTriggers: { code: string; status: ResolutionStatus }[][] = [
        [
          {
            code: "TRPR0001",
            status: "Unresolved"
          }
        ]
      ]

      cy.task("clearCourtCases")
      cy.task("insertDummyCourtCasesWithTriggers", {
        caseTriggers,
        orgCode: "01",
        triggersLockedByUsername: "Bichard01"
      })
      cy.login("bichard01@example.com", "password")
      cy.visit(caseURL)

      cy.get(".trigger-header input[type='checkbox']").check()
      cy.get("#mark-triggers-complete-button").click()
      cy.get("span.moj-badge--green").should("have.text", "Complete")
    })

    it("should be able to resolve all triggers on a case using 'select all' if all are unresolved", () => {
      const caseTriggers: { code: string; status: ResolutionStatus }[][] = [
        [
          {
            code: "TRPR0001",
            status: "Unresolved"
          },
          {
            code: "TRPR0002",
            status: "Unresolved"
          },
          {
            code: "TRPR0003",
            status: "Unresolved"
          },
          {
            code: "TRPR0004",
            status: "Unresolved"
          }
        ]
      ]

      cy.task("clearCourtCases")
      cy.task("insertDummyCourtCasesWithTriggers", {
        caseTriggers,
        orgCode: "01",
        triggersLockedByUsername: "Bichard01"
      })
      cy.login("bichard01@example.com", "password")
      cy.visit(caseURL)

      cy.get("#select-all-triggers button").click()
      cy.get("#mark-triggers-complete-button").click()
      cy.get("span.moj-badge--green")
        .should("have.length", caseTriggers[0].length)
        .each((el) => cy.wrap(el).should("have.text", "Complete"))
    })
  })
})
