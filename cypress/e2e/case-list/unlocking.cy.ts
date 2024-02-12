import { TestTrigger } from "../../../test/utils/manageTriggers"
import { defaultSetup, loginAndGoToUrl } from "../../support/helpers"

const unlockCase = (
  caseToUnlockNumber: number,
  caseToUnlockText: string,
  unlockTriggersOrExceptions: "Exceptions" | "Triggers"
) => {
  cy.get("tbody")
    .eq(caseToUnlockNumber - 1)
    .find(`tr${unlockTriggersOrExceptions === "Exceptions" ? ":first-child" : ":last-child"} .locked-by-tag`)
    .get("button")
    .contains(caseToUnlockText)
    .click()
  cy.get("button").contains("Unlock").click()
}

const checkLockStatus = (
  caseNumber: number,
  rowNumber: number,
  lockedByText: string,
  lockedByAssertion: [string, string | undefined],
  lockedTagAssertion: [string, string | undefined]
) => {
  if (lockedByText) {
    cy.get("tbody")
      .eq(caseNumber)
      .find(`tr:nth-child(${rowNumber}) .locked-by-tag`)
      .get("button")
      .contains(lockedByText)
      .should(...lockedByAssertion)
    cy.get("tbody")
      .eq(caseNumber)
      .find(`tr:nth-child(${rowNumber}) img[alt="Lock icon"]`)
      .should(...lockedTagAssertion)
  } else {
    cy.get("tbody")
      .eq(caseNumber)
      .find(`tr:nth-child(${rowNumber}) .locked-by-tag`)
      .should(...lockedByAssertion)
    cy.get("tbody")
      .eq(caseNumber)
      .find(`tr:nth-child(${rowNumber}) img[alt="Lock icon"]`)
      .should(...lockedTagAssertion)
  }
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
    checkLockStatus(0, 1, "Bichard Test User 01", ["exist", undefined], ["exist", undefined])
    // Trigger lock
    checkLockStatus(0, 2, "Bichard Test User 01", ["exist", undefined], ["exist", undefined])
    // User should not see unlock button when a case assigned to another user
    checkLockStatus(1, 1, "Bichard Test User 02", ["not.exist", undefined], ["exist", undefined])
    // Unlock the exception assigned to the user
    unlockCase(1, "Bichard Test User 01", "Exceptions")
    checkLockStatus(0, 1, "", ["not.exist", undefined], ["not.exist", undefined])
    checkLockStatus(0, 2, "Bichard Test User 01", ["exist", undefined], ["exist", undefined])
    checkLockStatus(1, 1, "", ["have.text", "Bichard Test User 02"], ["exist", undefined])
    // Unlock the trigger assigned to the user
    unlockCase(2, "Bichard Test User 01", "Triggers")
    checkLockStatus(0, 2, "", ["not.exist", undefined], ["not.exist", undefined])
    checkLockStatus(1, 1, "", ["have.text", "Bichard Test User 02"], ["exist", undefined])
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

    checkLockStatus(0, 1, "", ["have.text", "Bichard Test User 01"], ["exist", undefined])
    cy.get("tbody").eq(0).find("tr:nth-child(1) td:nth-child(7)").should("contain.text", "TRPR0001")
    checkLockStatus(1, 1, "", ["have.text", "Bichard Test User 02"], ["exist", undefined])
    cy.get("tbody").eq(1).find("tr:nth-child(1) td:nth-child(7)").should("contain.text", "TRPR0001")
    checkLockStatus(2, 1, "", ["not.exist", undefined], ["not.exist", undefined])
    cy.get("tbody").eq(2).find(`tr:nth-child(1) td:nth-child(7)`).should("contain.text", "TRPR0001")
    checkLockStatus(3, 1, "", ["have.text", "A Really Really Really Long Name"], ["exist", undefined])
    cy.get("tbody").eq(3).find(`tr:nth-child(1) td:nth-child(7)`).should("contain.text", "TRPR0001")
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
    checkLockStatus(0, 1, "Bichard Test User 01", ["exist", undefined], ["exist", undefined])
    checkLockStatus(0, 2, "Bichard Test User 01", ["exist", undefined], ["exist", undefined])
    checkLockStatus(1, 1, "Bichard Test User 01", ["exist", undefined], ["exist", undefined])

    // Unlock both cases
    unlockCase(1, "Bichard Test User 01", "Exceptions")
    unlockCase(1, "Bichard Test User 01", "Triggers")
    unlockCase(2, "Bichard Test User 02", "Exceptions")

    checkLockStatus(0, 1, "", ["not.exist", undefined], ["not.exist", undefined])
    checkLockStatus(0, 2, "", ["not.exist", undefined], ["not.exist", undefined])
    checkLockStatus(1, 1, "", ["not.exist", undefined], ["not.exist", undefined])
  })
})
