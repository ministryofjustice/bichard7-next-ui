import { TestTrigger } from "../../../test/utils/manageTriggers"
import { defaultSetup, loginAndGoToUrl } from "../../support/helpers"

const unlockCase = (caseToUnlockNumber: string, caseToUnlockText: string) => {
  cy.get(`tbody tr:nth-child(${caseToUnlockNumber}) .locked-by-tag`).get("button").contains(caseToUnlockText).click()
  cy.get("button").contains("Unlock").click()
}

describe("Case unlocked badge", () => {
  before(() => {
    defaultSetup()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should show case unlocked badge when exception handler unlocks the case", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: "ExceptionHandler",
        triggerLockedByUsername: null,
        orgForPoliceFilter: "011111",
        errorCount: 1,
        errorReport: "HO100310||ds:OffenceReasonSequence"
      }
    ])

    loginAndGoToUrl("exceptionhandler@example.com")

    cy.get("#filter-button").click()
    cy.get("#keywords").type("NAME Defendant")
    cy.contains("Apply filters").click()

    cy.get("button.locked-by-tag").contains("Exception Handler User 0111").click()
    cy.get("#unlock").click()
    cy.get("span.moj-badge").contains("Case unlocked").should("exist")
  })

  it("Should show case unlocked badge when trigger handler unlocks the case", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        caseId: 0,
        errorLockedByUsername: null,
        triggerLockedByUsername: "TriggerHandler",
        orgForPoliceFilter: "011111",
        triggerCount: 1
      }
    ])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndGoToUrl("triggerhandler@example.com")

    cy.get("#filter-button").click()
    cy.get("#keywords").type("NAME Defendant")
    cy.contains("Apply filters").click()

    cy.get("button.locked-by-tag").contains("Trigger Handler User 0111").click()
    cy.get("#unlock").click()
    cy.get("span.moj-badge").contains("Case unlocked").should("exist")
  })

  it("Should unlock a case that is locked to the user", () => {
    const lockUsernames = ["Bichard01", "Bichard02"]
    cy.task(
      "insertCourtCasesWithFields",
      lockUsernames.map((username) => ({
        errorLockedByUsername: username,
        triggerLockedByUsername: username,
        orgForPoliceFilter: "011111",
        errorCount: 1,
        errorReport: "HO100310||ds:OffenceReasonSequence",
        triggerCount: 1
      }))
    )
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndGoToUrl()

    // Exception lock
    cy.get(`tbody tr:nth-child(1) .locked-by-tag`).get("button").contains("Bichard Test User 01").should("exist")
    cy.get(`tbody tr:nth-child(1) img[alt="Lock icon"]`).should("exist")
    // Trigger lock
    cy.get(`tbody tr:nth-child(2) .locked-by-tag`).get("button").contains("Bichard Test User 01").should("exist")
    cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("exist")
    // User should not see unlock button when a case assigned to another user
    cy.get(`tbody tr:nth-child(3) .locked-by-tag`).get("button").contains("Bichard Test User 02").should("not.exist")
    cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("exist")

    // Unlock the exception assigned to the user
    unlockCase("1", "Bichard Test User 01")
    cy.get(`tbody tr:nth-child(1) .locked-by-tag`).should("not.exist")
    cy.get(`tbody tr:nth-child(1) img[alt="Lock icon"]`).should("not.exist")
    cy.get(`tbody tr:nth-child(2) .locked-by-tag`).get("button").contains("Bichard Test User 01").should("exist")
    cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("exist")
    cy.get(`tbody tr:nth-child(3) .locked-by-tag`).should("have.text", "Bichard Test User 02")
    cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("exist")

    // Unlock the trigger assigned to the user
    unlockCase("2", "Bichard Test User 01")
    cy.get(`tbody tr:nth-child(2) .locked-by-tag`).should("not.exist")
    cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("not.exist")
    cy.get(`tbody tr:nth-child(3) .locked-by-tag`).should("have.text", "Bichard Test User 02")
    cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("exist")
  })

  it("shows who has locked a case in the 'locked by' column", () => {
    const lockUsernames = ["Bichard01", "Bichard02", null, "A really really really long.name"]
    cy.task(
      "insertCourtCasesWithFields",
      lockUsernames.map((username) => ({
        errorLockedByUsername: username,
        triggerLockedByUsername: username,
        orgForPoliceFilter: "011111"
      }))
    )
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })
    cy.task("insertTriggers", { caseId: 1, triggers })
    cy.task("insertTriggers", { caseId: 2, triggers })
    cy.task("insertTriggers", { caseId: 3, triggers })

    loginAndGoToUrl()

    cy.get(`tbody tr:nth-child(1) .locked-by-tag`).should("have.text", "Bichard Test User 01")
    cy.get(`tbody tr:nth-child(1) img[alt="Lock icon"]`).should("exist")
    cy.get(`tbody tr:nth-child(1) td:nth-child(8)`).should("contain.text", "TRPR0001")
    cy.get(`tbody tr:nth-child(2) .locked-by-tag`).should("have.text", "Bichard Test User 02")
    cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("exist")
    cy.get(`tbody tr:nth-child(2) td:nth-child(8)`).should("contain.text", "TRPR0001")
    cy.get(`tbody tr:nth-child(3) .locked-by-tag`).should("not.exist")
    cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("not.exist")
    cy.get(`tbody tr:nth-child(3) td:nth-child(8)`).should("contain.text", "TRPR0001")
    cy.get(`tbody tr:nth-child(4) .locked-by-tag`).should("have.text", "A Really Really Really Long Name")
    cy.get(`tbody tr:nth-child(4) img[alt="Lock icon"]`).should("exist")
    cy.get(`tbody tr:nth-child(4) td:nth-child(8)`).should("contain.text", "TRPR0001")
  })

  it("Should unlock any case as a supervisor user", () => {
    const lockUsernames = ["Bichard01", "Bichard02"]
    cy.task(
      "insertCourtCasesWithFields",
      lockUsernames.map((username) => ({
        errorLockedByUsername: username,
        triggerLockedByUsername: username,
        orgForPoliceFilter: "011111",
        errorCount: 1,
        errorReport: "HO100310||ds:OffenceReasonSequence",
        triggerCount: 1
      }))
    )

    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndGoToUrl("supervisor@example.com")

    cy.get(`tbody tr:nth-child(1) .locked-by-tag`).get("button").contains("Bichard Test User 01").should("exist")
    cy.get(`tbody tr:nth-child(1) img[alt="Lock icon"]`).should("exist")
    cy.get(`tbody tr:nth-child(2) .locked-by-tag`).get("button").contains("Bichard Test User 01").should("exist")
    cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("exist")
    cy.get(`tbody tr:nth-child(3) .locked-by-tag`).get("button").contains("Bichard Test User 02").should("exist")
    cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("exist")

    // Unlock both cases
    unlockCase("1", "Bichard Test User 01")
    unlockCase("2", "Bichard Test User 01")
    unlockCase("3", "Bichard Test User 02")

    cy.get(`tbody tr:nth-child(1) .locked-by-tag`).should("not.exist")
    cy.get(`tbody tr:nth-child(1) img[alt="Lock icon"]`).should("not.exist")
    cy.get(`tbody tr:nth-child(2) .locked-by-tag`).should("not.exist")
    cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("not.exist")
    cy.get(`tbody tr:nth-child(3) .locked-by-tag`).should("not.exist")
    cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("not.exist")
  })
})
