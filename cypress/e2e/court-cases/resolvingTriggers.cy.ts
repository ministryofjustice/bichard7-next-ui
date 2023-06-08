import User from "services/entities/User"
import hashedPassword from "../../fixtures/hashedPassword"
import { ResolutionStatus } from "types/ResolutionStatus"

describe("Manually resolve a case", () => {
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

  const caseURL = "/bichard/court-cases/0"

  before(() => {
    cy.task("clearUsers")
    cy.task("insertUsers", { users: defaultUsers, userGroups: ["B7NewUI_grp", "B7TriggerHandler_grp"] })
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("should be able to resolve a trigger", () => {
    const caseTriggers: { code: string; status: ResolutionStatus }[][] = [
      [
        {
          code: "TRPR0001",
          status: "Unresolved"
        }
      ]
    ]

    cy.task("insertDummyCourtCasesWithTriggers", { caseTriggers, orgCode: "01", triggersLockedByUsername: "Bichard01" })
    cy.login("bichard01@example.com", "password")
    cy.visit(caseURL)

    cy.get(".trigger-header input[type='checkbox']").check()
    cy.get("#mark-triggers-complete-button").click()
    cy.get("span.moj-badge--green").should("have.text", "Complete")
  })

  it("should be able to resolve all triggers on a case using 'select all' if all are unresolved", () => {
    const caseTriggers: { code: string; status: ResolutionStatus }[][] = [
      [
        {
          code: "TRPR0001",
          status: "Unresolved"
        },
        {
          code: "TRPR0002",
          status: "Unresolved"
        },
        {
          code: "TRPR0003",
          status: "Unresolved"
        },
        {
          code: "TRPR0004",
          status: "Unresolved"
        }
      ]
    ]

    cy.task("insertDummyCourtCasesWithTriggers", { caseTriggers, orgCode: "01", triggersLockedByUsername: "Bichard01" })
    cy.login("bichard01@example.com", "password")
    cy.visit(caseURL)

    cy.get("#select-all-triggers").click()
    cy.get("#mark-triggers-complete-button").click()
    cy.get("span.moj-badge--green").should("have.length", caseTriggers.length).should("have.text", "Complete")
  })
})

export {}
