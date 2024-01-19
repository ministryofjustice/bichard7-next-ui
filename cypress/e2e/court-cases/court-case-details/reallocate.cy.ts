import User from "services/entities/User"
import { TestTrigger } from "../../../../test/utils/manageTriggers"
import canReallocateTestData from "../../../fixtures/canReallocateTestData.json"
import hashedPassword from "../../../fixtures/hashedPassword"
import { clickTab } from "../../../support/helpers"

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

  it("Should be able to reallocate a case is visible to the user and not locked by another user", () => {
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
    cy.contains("H2", "Case reallocation").should("exist")

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

    clickTab("Notes")

    cy.get("table tbody tr:visible").should("have.length", 3)
    cy.get("table tbody tr:visible").should(
      "contain",
      "Bichard01: Portal Action: Update Applied. Element: forceOwner. New Value: 03"
    )
    cy.get("table tbody tr:visible").should("contain", "Bichard01: Case reallocated to new force owner: 03YZ00")
    cy.get("table tbody tr:visible").should("contain", "This is a dummy note")
  })

  it("Should be able to reallocate a case without note", () => {
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
    cy.contains("H2", "Case reallocation").should("exist")
    cy.findByText("Cancel").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="force"]').select("03 - Cumbria")
    cy.get("span").should("contain", "You have 1000 characters remaining")
    cy.get("button").contains("Reallocate").click()

    cy.get("H1").should("have.text", "Case list")
    cy.contains("NAME Defendant").should("not.exist")

    cy.login("bichard03@example.com", "password")
    cy.visit("/bichard")
    cy.findByText("NAME Defendant").click()

    clickTab("Notes")

    cy.get("table tbody tr:visible").should("have.length", 2)
    cy.get("table tbody tr:visible").should(
      "contain",
      "Bichard01: Portal Action: Update Applied. Element: forceOwner. New Value: 03"
    )
    cy.get("table tbody tr:visible").should("contain", "Bichard01: Case reallocated to new force owner: 03YZ00")
  })

  it("Should not accept more than 1000 characters in note text field", () => {
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
    cy.contains("H2", "Case reallocation").should("exist")
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

    clickTab("Notes")

    cy.get("table tbody tr:visible").should("have.length", 3)
    cy.get("table tbody tr:visible").should(
      "contain",
      "Bichard01: Portal Action: Update Applied. Element: forceOwner. New Value: 03"
    )
    cy.get("table tbody tr:visible").should("contain", "Bichard01: Case reallocated to new force owner: 03YZ00")
    cy.get("table tbody tr:visible").should("not.contain", "a".repeat(1001))
    cy.get("table tbody tr:visible").should("contain", "a".repeat(1000))
  })

  it("Should return 404 for a case that this user can not see", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "02" }])
    cy.login("bichard01@example.com", "password")

    cy.request({
      failOnStatusCode: false,
      url: "/bichard/court-cases/0/reallocate"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("Should return 404 for a case that does not exist", () => {
    cy.login("bichard01@example.com", "password")

    cy.request({
      failOnStatusCode: false,
      url: "/court-cases/1/notes/reallocate"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  canReallocateTestData.forEach(
    ({ canReallocate, triggers, exceptions, triggersLockedByAnotherUser, exceptionLockedByAnotherUser }) => {
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
          expect(response.status).to.eq(canReallocate ? 200 : 403)
        })
      })
    }
  )

  it("Should not allow reallocating phase 2 cases", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "01", phase: 1 },
      { orgForPoliceFilter: "01", phase: 2 }
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
    cy.login("bichard01@example.com", "password")

    cy.visit("/bichard/court-cases/0")

    cy.get(".govuk-tag:visible")
      .contains(
        "This case can not be reallocated within new bichard; Switch to the old bichard to reallocate this case."
      )
      .should("not.exist")

    cy.visit("/bichard/court-cases/1")

    cy.get(".govuk-tag")
      .contains(
        "This case can not be reallocated within new bichard; Switch to the old bichard to reallocate this case."
      )
      .should("exist")

    cy.visit("/bichard/court-cases/1/reallocate")
    cy.url().should("match", /\/court-cases\/\d+/)
  })
})

export {}
