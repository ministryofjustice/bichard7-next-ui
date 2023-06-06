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

  before(() => {
    cy.task("clearUsers")
    cy.task("insertUsers", { users: defaultUsers, userGroups: ["B7NewUI_grp", "B7GeneralHandler_grp"] })
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

    cy.task("insertDummyCourtCasesWithTriggers", { caseTriggers, orgCode: "01" })
    cy.login("bichard01@example.com", "password")

    cy.visit("/bichard")

    cy.findByText("NAME Defendant").click()

    cy.get("button").contains("Resolve trigger").click()
    cy.get("span.moj-badge--green").should("have.text", "Complete")
  })
})

export {}
