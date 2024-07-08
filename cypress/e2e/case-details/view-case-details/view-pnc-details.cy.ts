import { loginAndVisit } from "../../../support/helpers"

describe("when doing something", () => {
  beforeEach(() => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01", errorCount: 0 }])
  })

  afterEach(() => {
    cy.task("clearCourtCases")
  })

  it("is exists", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get(".case-details-sidebar #pnc-details").should("exist")
  })

  it("can be clicked on to display", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("#pnc-details-tab").click()

    cy.get(".case-details-sidebar #pnc-details").should("be.visible")
  })
})
