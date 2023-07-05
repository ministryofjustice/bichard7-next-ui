import User from "services/entities/User"
import hashedPassword from "../../../fixtures/hashedPassword"

describe("Court case details", () => {
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
    const existingUserLock = "Another name"
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
    cy.get("#triggers-locked-tag-lockee").should("contain.text", "Another Name 01")
    cy.get("#exceptions-locked-tag").should("exist")
    cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Another Name 01")
  })
})

export {}
