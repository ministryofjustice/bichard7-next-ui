import { defaultSetup, loginAndGoToUrl } from "../support/helpers"

describe("Case list", () => {
  before(() => {
    defaultSetup()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid", () => {
    loginAndGoToUrl()
    cy.checkCsrf("/bichard", "POST")
    cy.checkCsrf("/bichard/court-cases/0", "POST")
    cy.checkCsrf("/bichard/court-cases/0/reallocate", "POST")
    cy.checkCsrf("/bichard/court-cases/0/resolve", "POST")
    cy.checkCsrf("/bichard/switching-feedback", "POST")
    cy.checkCsrf("/bichard/feedback", "POST")
  })
})
