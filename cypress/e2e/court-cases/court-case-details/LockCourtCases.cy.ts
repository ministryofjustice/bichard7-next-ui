import User from "services/entities/User"
import hashedPassword from "../../../fixtures/hashedPassword"
import { UserGroup } from "types/UserGroup"
import { newUserLogin } from "../../../support/helpers"

describe("Lock court cases", () => {
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
    cy.task("clearCourtCases")
    cy.task("clearUsers")
    cy.task("insertUsers", { users, userGroups: ["B7NewUI_grp"] })
    cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7TriggerHandler_grp" })
    cy.task("insertIntoUserGroup", { emailAddress: "bichard02@example.com", groupName: "B7ExceptionHandler_grp" })
    cy.task("insertIntoUserGroup", { emailAddress: "bichard03@example.com", groupName: "B7Supervisor_grp" })
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("should lock a case when a user views a case details page", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "03",
        errorCount: 1,
        triggerCount: 1
      }
    ])

    cy.login("bichard03@example.com", "password")
    cy.visit("/bichard")

    cy.contains("a", "NAME Defendant").click()

    cy.get(".view-only-badge").should("not.exist")
    cy.get("#triggers-locked-tag").should("exist")
    cy.get("#triggers-locked-tag-lockee").should("contain.text", "Locked to you")
    cy.get("#exceptions-locked-tag").should("exist")
    cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Locked to you")
  })

  it("should not lock a case that is already locked to another user", () => {
    const existingUserLock = "Another.name"
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: existingUserLock,
        triggerLockedByUsername: existingUserLock,
        orgForPoliceFilter: "03",
        errorCount: 1,
        triggerCount: 1
      }
    ])

    cy.login("bichard03@example.com", "password")
    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()

    cy.get(".view-only-badge").should("exist")
    cy.get("#triggers-locked-tag").should("exist")
    cy.get("#triggers-locked-tag-lockee").should("contain.text", "Another Name")
    cy.get("#exceptions-locked-tag").should("exist")
    cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Another Name")
  })

  it("should not lock exceptions when a trigger handler clicks into a case", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 1
      }
    ])

    newUserLogin({ user: "trigger-handler-user", groups: [UserGroup.TriggerHandler] })

    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()

    cy.get("#exceptions-locked-tag").should("not.exist")
  })

  it("should only lock exceptions on an unlocked case if triggers are already resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "03",
        errorCount: 1,
        errorStatus: "Unresolved",
        triggerCount: 1,
        triggerStatus: "Resolved"
      }
    ])

    cy.login("bichard03@example.com", "password")
    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()

    cy.get("#triggers-resolved-tag").should("exist").should("contain.text", "Resolved")
    cy.get("#triggers-locked-tag").should("not.exist")
    cy.get("#exceptions-locked-tag-lockee").should("exist")
    cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Locked to you")
  })

  it("should only lock triggers on an unlocked case if exceptions are already resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "03",
        errorCount: 1,
        errorStatus: "Resolved",
        triggerCount: 1,
        triggerStatus: "Unresolved"
      }
    ])

    cy.login("bichard03@example.com", "password")
    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()

    cy.get("#exceptions-resolved-tag").should("exist").should("contain.text", "Resolved")
    cy.get("#exceptions-locked-tag").should("not.exist")
    cy.get("#triggers-locked-tag").should("exist")
    cy.get("#triggers-locked-tag-lockee").should("contain.text", "Locked to you")
  })

  it("shouldn't lock exceptions on an unlocked case if exceptions are submitted", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "03",
        errorCount: 1,
        errorStatus: "Submitted",
        triggerCount: 1,
        triggerStatus: "Unresolved"
      }
    ])

    cy.login("bichard03@example.com", "password")
    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()

    cy.get("#exceptions-submitted-tag").should("exist").should("contain.text", "Submitted")
    cy.get("#exceptions-locked-tag").should("not.exist")
    cy.get("#triggers-resolved-tag").should("not.exist")
    cy.get("#triggers-locked-tag-lockee").should("contain.text", "Locked to you")
  })

  it("shouldn't lock exceptions or triggers on an unlocked case if exceptions are submitted and triggers are resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "03",
        errorCount: 1,
        errorStatus: "Submitted",
        triggerCount: 1,
        triggerStatus: "Resolved"
      }
    ])

    cy.login("bichard03@example.com", "password")
    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()

    cy.get("#exceptions-submitted-tag").should("exist").should("contain.text", "Submitted")
    cy.get("#exceptions-locked-tag").should("not.exist")
    cy.get("#triggers-resolved-tag").should("exist").should("contain.text", "Resolved")
    cy.get("#triggers-locked-tag").should("not.exist")
  })

  it("shouldn't lock either triggers nor exceptions on an unlocked case if both are already resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "03",
        errorCount: 1,
        errorStatus: "Resolved",
        triggerCount: 1,
        triggerStatus: "Resolved"
      }
    ])

    cy.login("bichard03@example.com", "password")
    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()

    cy.get("#exceptions-resolved-tag").should("exist").should("contain.text", "Resolved")
    cy.get("#exceptions-locked-tag").should("not.exist")
    cy.get("#triggers-resolved-tag").should("exist").should("contain.text", "Resolved")
    cy.get("#triggers-locked-tag").should("not.exist")
  })
})

export {}
