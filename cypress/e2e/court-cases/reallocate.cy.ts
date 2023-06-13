import User from "services/entities/User"
import { TestTrigger } from "../../../test/utils/manageTriggers"
import hashedPassword from "../../fixtures/hashedPassword"

describe("Case details", () => {
  const defaultUsers: Partial<User>[] = Array.from(Array(4)).map((_value, idx) => {
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
    cy.task("clearUsers")
    cy.task("insertUsers", { users: defaultUsers, userGroups: ["B7NewUI_grp", "B7GeneralHandler_grp"] })
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("should be able to reallocate a case is visible to the user and not locked by another user", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    cy.login("bichard01@example.com", "password")

    cy.visit("/bichard")

    cy.findByText("NAME Defendant").click()

    cy.get("button").contains("Reallocate Case").click()
    cy.get("H2").should("have.text", "Case reallocation")

    cy.findByText("Cancel").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="force"]').select("03 - Cumbria")
    cy.get('textarea[name="note"]').type("This is a dummy note")
    cy.get("span").should("contain", "You have 980 characters remaining")
    cy.get("button").contains("Reallocate").click()

    cy.get("H1").should("have.text", "Case list")
    cy.contains("NAME Defendant").should("not.exist")

    cy.login("bichard03@example.com", "password")
    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()
    cy.get(".moj-sub-navigation a").contains("Notes").click()
    cy.get("table tbody tr").should("have.length", 3)
    cy.get("table tbody tr").should(
      "contain",
      "Bichard01: Portal Action: Update Applied. Element: forceOwner. New Value: 03"
    )
    cy.get("table tbody tr").should("contain", "Bichard01: Case reallocated to new force owner: 03YZ00")
    cy.get("table tbody tr").should("contain", "This is a dummy note")
  })

  it("should be able to reallocate a case without note", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    cy.login("bichard01@example.com", "password")

    cy.visit("/bichard")

    cy.findByText("NAME Defendant").click()

    cy.get("button").contains("Reallocate Case").click()
    cy.get("H2").should("have.text", "Case reallocation")
    cy.findByText("Cancel").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="force"]').select("03 - Cumbria")
    cy.get("span").should("contain", "You have 1000 characters remaining")
    cy.get("button").contains("Reallocate").click()

    cy.get("H1").should("have.text", "Case list")
    cy.contains("NAME Defendant").should("not.exist")

    cy.login("bichard03@example.com", "password")
    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()
    cy.get(".moj-sub-navigation a").contains("Notes").click()
    cy.get("table tbody tr").should("have.length", 2)
    cy.get("table tbody tr").should(
      "contain",
      "Bichard01: Portal Action: Update Applied. Element: forceOwner. New Value: 03"
    )
    cy.get("table tbody tr").should("contain", "Bichard01: Case reallocated to new force owner: 03YZ00")
  })

  it("should not accept more than 1000 characters in note text field", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    cy.login("bichard01@example.com", "password")

    cy.visit("/bichard")

    cy.findByText("NAME Defendant").click()

    cy.get("button").contains("Reallocate Case").click()
    cy.get("H2").should("have.text", "Case reallocation")
    cy.findByText("Cancel").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="force"]').select("03 - Cumbria")
    cy.get('textarea[name="note"]').then((element) => {
      element[0].textContent = "a".repeat(990)
    })
    cy.get('textarea[name="note"]').type("a".repeat(20))
    cy.get("span").should("contain", "You have 0 characters remaining")
    cy.get("button").contains("Reallocate").click()

    cy.get("H1").should("have.text", "Case list")
    cy.contains("NAME Defendant").should("not.exist")

    cy.login("bichard03@example.com", "password")
    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()
    cy.get(".moj-sub-navigation a").contains("Notes").click()
    cy.get("table tbody tr").should("have.length", 3)
    cy.get("table tbody tr").should(
      "contain",
      "Bichard01: Portal Action: Update Applied. Element: forceOwner. New Value: 03"
    )
    cy.get("table tbody tr").should("contain", "Bichard01: Case reallocated to new force owner: 03YZ00")
    cy.get("table tbody tr").should("not.contain", "a".repeat(1001))
    cy.get("table tbody tr").should("contain", "a".repeat(1000))
  })

  it("should return 404 for a case that this user can not see", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "02" }])
    cy.login("bichard01@example.com", "password")

    cy.request({
      failOnStatusCode: false,
      url: "/bichard/court-cases/0/reallocate"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("should return 404 for a case that does not exist", () => {
    cy.login("bichard01@example.com", "password")

    cy.request({
      failOnStatusCode: false,
      url: "/court-cases/1/notes/reallocate"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  const cannotReallocateTestData = [
    {
      triggers: "Resolved",
      exceptions: "Resolved",
      triggersLockedByAnotherUser: false,
      exceptionLockedByAnotherUser: false
    },
    {
      triggers: "Resolved",
      exceptions: "Submitted",
      triggersLockedByAnotherUser: false,
      exceptionLockedByAnotherUser: false
    },
    {
      triggers: "Resolved",
      exceptions: "Unresolved",
      triggersLockedByAnotherUser: false,
      exceptionLockedByAnotherUser: true
    },
    {
      triggers: "Unresolved",
      exceptions: "Submitted",
      triggersLockedByAnotherUser: true,
      exceptionLockedByAnotherUser: false
    }
  ]

  cannotReallocateTestData.forEach(
    ({ triggers, exceptions, triggersLockedByAnotherUser, exceptionLockedByAnotherUser }) => {
      it(`should return 403 when triggers are ${triggers} and ${
        triggersLockedByAnotherUser ? "" : "NOT"
      } locked by another user, and exceptions are ${exceptions} and ${
        exceptionLockedByAnotherUser ? "" : "NOT"
      } locked by another user`, () => {
        cy.task("insertCourtCasesWithFields", [
          {
            orgForPoliceFilter: "01",
            triggerStatus: triggers,
            errorStatus: exceptions,
            triggersLockedByAnotherUser: triggersLockedByAnotherUser ? "Bichard03" : null,
            errorLockedByUsername: exceptionLockedByAnotherUser ? "Bichard03" : null
          }
        ])

        cy.login("bichard01@example.com", "password")

        cy.request({
          failOnStatusCode: false,
          url: "/bichard/court-cases/0/reallocate"
        }).then((response) => {
          expect(response.status).to.eq(403)
        })
      })
    }
  )

  const canReallocateTestData = [
    {
      triggers: "Unresolved",
      exceptions: "Unresolved",
      triggersLockedByAnotherUser: false,
      exceptionLockedByAnotherUser: false
    },
    {
      triggers: "Unresolved",
      exceptions: "Resolved",
      triggersLockedByAnotherUser: false,
      exceptionLockedByAnotherUser: true
    },
    {
      triggers: "Resolved",
      exceptions: "Unresolved",
      triggersLockedByAnotherUser: true,
      exceptionLockedByAnotherUser: false
    }
  ]

  canReallocateTestData.forEach(
    ({ triggers, exceptions, triggersLockedByAnotherUser, exceptionLockedByAnotherUser }) => {
      it(`should return 200 when triggers are ${triggers} and ${
        triggersLockedByAnotherUser ? "" : "NOT"
      } locked by another user, and exceptions are ${exceptions} and ${
        exceptionLockedByAnotherUser ? "" : "NOT"
      } locked by another user`, () => {
        cy.task("insertCourtCasesWithFields", [
          {
            orgForPoliceFilter: "01",
            triggerStatus: triggers,
            errorStatus: exceptions,
            triggersLockedByAnotherUser: triggersLockedByAnotherUser ? "Bichard03" : null,
            errorLockedByUsername: exceptionLockedByAnotherUser ? "Bichard03" : null
          }
        ])

        cy.login("bichard01@example.com", "password")

        cy.request({
          failOnStatusCode: false,
          url: "/bichard/court-cases/0/reallocate"
        }).then((response) => {
          expect(response.status).to.eq(200)
        })
      })
    }
  )
})

export {}
