import User from "../../../../src/services/entities/User"
import hashedPassword from "../../../fixtures/hashedPassword"

describe("View court case details header", () => {
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
    cy.task("insertIntoUserGroup", { emailAddress: "bichard03@example.com", groupName: "B7ExceptionHandler_grp" })
    cy.task("insertIntoUserGroup", { emailAddress: "bichard04@example.com", groupName: "B7GeneralHandler_grp" })
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("should have a leave and lock button that returns to the case list when the case is locked", () => {
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
    cy.get(".locked-by-tag").should("have.text", "Bichard Test User 01")
    cy.get("td a").contains("NAME Defendant").click()
    cy.location("pathname").should("equal", "/bichard/court-cases/0")

    cy.get("button#leave-and-lock")
      .should("have.text", "Leave and lock")
      .parent()
      .should("have.attr", "href", "/bichard")
    cy.get("button#leave-and-lock").click()
    cy.location("pathname").should("equal", "/bichard")
    cy.get(".locked-by-tag").should("have.text", "Bichard Test User 01")
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
    cy.get("button#leave-and-unlock").should("not.exist")
    cy.get("button#return-to-case-list").should("exist").should("have.text", "Return to case list")
    cy.get("button#return-to-case-list").click()
    cy.location("pathname").should("equal", "/bichard")
  })

  it("should have a leave and unlock button that unlocks the triggers when you have the triggers locked", () => {
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
    cy.get(".locked-by-tag").should("have.text", "Bichard Test User 01")
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

  it("should have a leave and unlock button that unlocks both triggers and exceptions when both triggers and exceptions are locked", () => {
    const user = users[4]
    cy.task("insertCourtCasesWithFields", [
      {
        triggerLockedByUsername: user.username,
        errorLockedByUsername: user.username,
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
    cy.get(".locked-by-tag").filter(':contains("Bichard Test User 04")').should("have.length", 1)
    cy.get("td a").contains("NAME Defendant").click()
    cy.location("pathname").should("equal", "/bichard/court-cases/0")

    cy.get("button#leave-and-unlock").should("exist").should("have.text", "Leave and unlock")
    cy.get("button#leave-and-unlock")
      .parent("form")
      .should("exist")
      .should("have.attr", "action", "/bichard?unlockException=0&unlockTrigger=0")
      .should("have.attr", "method", "post")

    cy.get("button#leave-and-unlock").click()
    cy.location("pathname").should("equal", "/bichard")
    cy.get(".locked-by-tag").should("not.exist")
  })

  describe("View only badge", () => {
    it("Should show a view only badge on a case that someone else has locked", () => {
      const caseURL = "/bichard/court-cases/0"
      const user = users[1]
      const otherUser = users[2]
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: otherUser.username,
          triggerLockedByUsername: otherUser.username,
          isUrgent: false,
          orgForPoliceFilter: user.visibleForces![0]
        }
      ])

      cy.login(user.email!, "password")
      cy.visit(caseURL)
      cy.get(".view-only-badge").contains("View only").should("exist").should("be.visible")
    })

    it("Should not show a view only badge on a case where we have both locks", () => {
      const caseURL = "/bichard/court-cases/0"
      const user = users[1]
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: user.username,
          triggerLockedByUsername: user.username,
          isUrgent: false,
          orgForPoliceFilter: user.visibleForces![0]
        }
      ])

      cy.login(user.email!, "password")
      cy.visit(caseURL)
      cy.get(".view-only-badge").should("not.exist")
    })

    it("Should not show a view only badge on a case where we have one lock and nobody holds the other lock", () => {
      const caseURL = "/bichard/court-cases/0"
      const user = users[1]
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: user.username,
          isUrgent: false,
          orgForPoliceFilter: user.visibleForces![0]
        }
      ])

      cy.login(user.email!, "password")
      cy.visit(caseURL)
      cy.get(".view-only-badge").should("not.exist")
    })

    it("Should not show a view only badge on a case where we have one lock and somebody else holds the other lock", () => {
      const caseURL = "/bichard/court-cases/0"
      const user = users[1]
      const otherUser = users[2]
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: otherUser.username,
          triggerLockedByUsername: user.username,
          isUrgent: false,
          orgForPoliceFilter: user.visibleForces![0]
        }
      ])

      cy.login(user.email!, "password")
      cy.visit(caseURL)
      cy.get(".view-only-badge").should("not.exist")
    })
  })

  describe("Case locks", () => {
    describe("General handler and supervisor view", () => {
      it("When we have both locks, it shows both lock components as locked to us", () => {
        const user = users[4]
        const caseURL = "/bichard/court-cases/0"
        cy.task("insertCourtCasesWithFields", [
          {
            errorLockedByUsername: user.username,
            triggerLockedByUsername: user.username,
            orgForPoliceFilter: user.visibleForces![0]
          }
        ])

        cy.login(user.email!, "password")
        cy.visit(caseURL)

        cy.get("#exceptions-locked-tag").should("exist")
        cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Locked to you")
        cy.get("#triggers-locked-tag").should("exist")
        cy.get("#triggers-locked-tag-lockee").should("contain.text", "Locked to you")
      })

      it("When we have one lock and someone else has the other, it shows both lock components correctly", () => {
        const user = users[4]
        const otherUser = users[1]
        const caseURL = "/bichard/court-cases/0"
        cy.task("insertCourtCasesWithFields", [
          {
            errorLockedByUsername: user.username,
            triggerLockedByUsername: otherUser.username,
            orgForPoliceFilter: user.visibleForces![0]
          }
        ])

        cy.login(user.email!, "password")
        cy.visit(caseURL)

        cy.get("#exceptions-locked-tag").should("exist")
        cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Locked to you")

        cy.get("#triggers-locked-tag").should("exist")
        cy.get("#triggers-locked-tag-lockee").should("contain.text", "Bichard Test User 01")
      })

      it("When someone else has both locks, it shows both lock components correctly", () => {
        const user = users[4]
        const otherUser = users[1]
        const caseURL = "/bichard/court-cases/0"
        cy.task("insertCourtCasesWithFields", [
          {
            errorLockedByUsername: otherUser.username,
            triggerLockedByUsername: otherUser.username,
            orgForPoliceFilter: user.visibleForces![0]
          }
        ])

        cy.login(user.email!, "password")
        cy.visit(caseURL)

        cy.get("#exceptions-locked-tag").should("exist")
        cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Bichard Test User 01")

        cy.get("#triggers-locked-tag").should("exist")
        cy.get("#triggers-locked-tag-lockee").should("contain.text", "Bichard Test User 01")
      })
    })

    describe("Trigger handler view", () => {
      it("When we have the triggers locked, it shows only the trigger lock", () => {
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

        cy.get("#exceptions-locked-tag").should("not.exist")
        cy.get("#triggers-locked-tag").should("exist")
        cy.get("#triggers-locked-tag-lockee").should("contain.text", "Locked to you")
      })

      it("When somebody else has the triggers locked, it shows only the trigger lock", () => {
        const user = users[1]
        const otherUser = users[4]
        const caseURL = "/bichard/court-cases/0"
        cy.task("insertCourtCasesWithFields", [
          {
            triggerLockedByUsername: otherUser.username,
            orgForPoliceFilter: user.visibleForces![0]
          }
        ])

        cy.login(user.email!, "password")
        cy.visit(caseURL)

        cy.get("#exceptions-locked-tag").should("not.exist")
        cy.get("#triggers-locked-tag").should("exist")
        cy.get("#triggers-locked-tag-lockee").should("contain.text", "Bichard Test User 04")
      })
    })

    describe("Exception handler view", () => {
      it("When we have the exceptions locked, it shows only the exception lock", () => {
        const user = users[3]
        const caseURL = "/bichard/court-cases/0"
        cy.task("insertCourtCasesWithFields", [
          {
            errorLockedByUsername: user.username,
            orgForPoliceFilter: user.visibleForces![0]
          }
        ])

        cy.login(user.email!, "password")
        cy.visit(caseURL)

        cy.get("#exceptions-locked-tag").should("exist")
        cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Locked to you")
        cy.get("#triggers-locked-tag").should("not.exist")
      })

      it("When somebody else has the exceptions locked, it shows only the exception lock", () => {
        const user = users[3]
        const otherUser = users[4]
        const caseURL = "/bichard/court-cases/0"
        cy.task("insertCourtCasesWithFields", [
          {
            errorLockedByUsername: otherUser.username,
            orgForPoliceFilter: user.visibleForces![0]
          }
        ])

        cy.login(user.email!, "password")
        cy.visit(caseURL)

        cy.get("#exceptions-locked-tag").should("exist")
        cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Bichard Test User 04")
        cy.get("#triggers-locked-tag").should("not.exist")
      })
    })
  })
})
