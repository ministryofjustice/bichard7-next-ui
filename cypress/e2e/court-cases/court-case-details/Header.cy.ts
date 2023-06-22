import User from "../../../../src/services/entities/User"
import hashedPassword from "../../../fixtures/hashedPassword"

describe("Court case details header", () => {
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
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("should load case details for the case that this user can see", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("H1").should("have.text", "Case details")

    cy.contains("Case00000")
    cy.contains("Magistrates' Courts Essex Basildon")
    cy.contains("NAME Defendant")

    // Urgency
    cy.contains("Urgent")
  })

  it("should lock a case when a user views a case details page", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "02",
        errorCount: 1,
        triggerCount: 1
      }
    ])

    cy.login("bichard02@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.findByText("Lock Court Case").click()
    cy.findByText("Case locked by another user").should("not.exist")
    cy.findByText("Trigger locked by: Bichard02").should("exist")
    cy.findByText("Error locked by: Bichard02").should("exist")
  })

  it("should not lock a court case when its already locked", () => {
    const existingUserLock = "Another name"
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: existingUserLock,
        triggerLockedByUsername: existingUserLock,
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 1
      }
    ])

    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")
    cy.findByText("Case locked by another user").should("exist")
    cy.findByText("Trigger locked by: Another name").should("exist")
    cy.findByText("Error locked by: Another name").should("exist")
  })

  it("should unlock and lock a court case when its already locked", () => {
    const existingUserLock = "Another name"
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: existingUserLock,
        triggerLockedByUsername: existingUserLock,
        orgForPoliceFilter: "02",
        errorCount: 1,
        triggerCount: 1
      }
    ])

    cy.login("bichard02@example.com", "password")
    cy.visit("/bichard/court-cases/0")
    cy.findByText("Case locked by another user").should("exist")
    cy.findByText("Trigger locked by: Another name").should("exist")
    cy.findByText("Error locked by: Another name").should("exist")

    cy.findByText("Unlock Court Case").click()
    cy.findByText("Case locked by another user").should("not.exist")
    cy.findByText("Trigger locked by: Another name").should("not.exist")
    cy.findByText("Error locked by: Another name").should("not.exist")

    cy.findByText("Lock Court Case").click()
    cy.findByText("Case locked by another user").should("not.exist")
    cy.findByText("Trigger locked by: Bichard02").should("exist")
    cy.findByText("Error locked by: Bichard02").should("exist")
  })
})
