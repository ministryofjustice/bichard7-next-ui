import { loginAndVisit } from "../../../../support/helpers"
import HO100320 from "../fixtures/HO100312-and-HO100320.json"

describe("Offence matching HO100320", () => {
  const fields = {
    defendantName: "Offence Matching HO100320",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100320,
    errorCount: 2,
    errorReason: "HO100320",
    errorReport: "HO100320||ds:OffenceReasonSequence"
  }

  before(() => {
    cy.loginAs("GeneralHandler")
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [fields])

    loginAndVisit()
    cy.get("a[class*='Link']").contains(fields.defendantName).click()
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()

    cy.get("#offences").contains("Aid and abet theft").click()
  })

  it("doesn't display the offence matcher for offences with a HO100320 exception", () => {
    cy.get("select.offence-matcher").should("not.exist")
  })
})
