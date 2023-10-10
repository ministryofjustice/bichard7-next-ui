import hashedPassword from "../../../fixtures/hashedPassword"

const caseURL = "/bichard/court-cases/0"

describe("Triggers and exceptions tabs", () => {
  before(() => {
    cy.task("clearUsers")
    cy.task("insertUsers", {
      users: [
        {
          username: "Bichard01",
          visibleForces: ["01"],
          forenames: "Bichard Test User",
          surname: "01",
          email: "bichard01@example.com",
          password: hashedPassword
        }
      ],
      userGroups: ["B7NewUI_grp", "B7GeneralHandler_grp"]
    })

    cy.login("bichard01@example.com", "password")

    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    ])

    cy.task("insertException", { caseId: 0, exceptionCode: "HO100402", errorReport: "test data" })
  })
  it("if there's a pnc exception, it should show up in the list", () => {})
})
