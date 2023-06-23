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
    cy.task("insertIntoUserGroup", { emailAddress: "bichard02@example.com", groupName: "B7Supervisor_grp" })
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
    cy.contains("NAME Defendant")
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

  it("should have a leave and lock button that returns to the case list when the case is locked", () => {
    const user = users[1]
    const caseURL = "/bichard/court-cases/0"
    cy.task("insertCourtCasesWithFields", [
      {
        triggerLockedByUsername: user.username,
        orgForPoliceFilter: user.visibleForces![0]
      }
    ])

    cy.login(user.email!, "password")
    cy.visit(caseURL)

    cy.get("button#leave-and-lock")
      .should("have.text", "Leave and lock")
      .parent()
      .should("have.attr", "href", "/bichard")
    cy.get("button#leave-and-lock").click()
    cy.location("pathname").should("equal", "/bichard")
  })

  it("should have a return to case list button that returns to the case list when the case isn't locked", () => {
    const user = users[1]
    const otherUser = users[2]
    const caseURL = "/bichard/court-cases/0"
    cy.task("insertCourtCasesWithFields", [
      {
        triggerLockedByUsername: otherUser.username,
        orgForPoliceFilter: user.visibleForces![0]
      }
    ])

    cy.login(user.email!, "password")
    cy.visit(caseURL)

    cy.get("button#leave-and-lock").should("not.exist")
    cy.get("button#return-to-case-list").should("exist").should("have.text", "Return to case list")
    cy.get("button#return-to-case-list").click()
    cy.location("pathname").should("equal", "/bichard")
  })

  it("should have a leave and unlock button when you have the trigger locked", () => {
    const user = users[1]
    cy.task("insertCourtCasesWithFields", [
      {
        triggerLockedByUsername: user.username,
        orgForPoliceFilter: user.visibleForces![0]
      }
    ])
    cy.task("insertTriggers", {
      caseId: 0,
      triggers: [
        {
          triggerId: 0,
          triggerCode: "TRPR0010",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
    })

    cy.login(user.email!, "password")

    cy.visit("/bichard")
    cy.get(".locked-by-tag").should("have.text", "Bichard01")
    cy.get("td a").contains("NAME Defendant").click()
    cy.location("pathname").should("equal", "/bichard/court-cases/0")

    cy.get("button#leave-and-unlock").should("exist").should("have.text", "Leave and unlock")
    cy.get("button#leave-and-unlock")
      .parent("form")
      .should("exist")
      .should("have.attr", "action", "/bichard?unlockTrigger=0")
      .should("have.attr", "method", "post")

    cy.get("button#leave-and-unlock").click()
    cy.location("pathname").should("equal", "/bichard")
    cy.get(".locked-by-tag").should("not.exist")
  })
})
