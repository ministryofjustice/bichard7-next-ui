import User from "services/entities/User"
import { TestTrigger } from "../../../test/utils/manageTriggers"
import hashedPassword from "../../fixtures/hashedPassword"

describe("Case details", () => {
  const defaultUsers: Partial<User>[] = Array.from(Array(2)).map((_value, idx) => {
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
    cy.get("H2").should("have.text", "Reallocate Case")
    cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="force"]').select("03")
    cy.get("button").contains("Reallocate").click()

    cy.get("H1").should("have.text", "Case list")
    cy.contains("NAME Defendant").should("not.exist")

    // TODO find out why cypress is filing to login twice in one test
    // cy.login("bichard03@example.com", "password")
    // cy.visit("/bichard")
    // cy.findByText("NAME Defendant").click()
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
})

export {}
