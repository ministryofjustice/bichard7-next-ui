import { loginAndVisit } from "../../../support/helpers"
import HO100310 from "./fixtures/HO100310.json"

describe("renders based on feature flag value for user", () => {
  const fields = {
    defendantName: "Offence Matching HO100310",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100310,
    errorCount: 2,
    errorReason: "HO100310",
    errorReport: "HO100310||ds:OffenceReasonSequence, HO100310||ds:OffenceReasonSequence"
  }

  before(() => {
    cy.loginAs("GeneralHandler")
    cy.loginAs("NoExceptionsFeatureFlag")
    cy.loginAs("OffenceMatchingDisabled")
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [fields])

    loginAndVisit()
    cy.get("a[class*='Link']").contains(fields.defendantName).click()
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()

    cy.get("#offences").contains("Theft of pedal cycle").click()
  })

  it("is disabled if the feature flag is non-existent", () => {
    loginAndVisit("NoExceptionsFeatureFlag", "/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()

    cy.get("a:contains('Theft of pedal cycle')").eq(0).click()
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("is disabled if the feature flag is disabled", () => {
    loginAndVisit("OffenceMatchingDisabled", "/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()

    cy.get("a:contains('Theft of pedal cycle')").eq(0).click()
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("is enabled if the feature flag is enabled", () => {
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()

    cy.get("a:contains('Theft of pedal cycle')").eq(0).click()
    cy.get("select.offence-matcher").should("be.enabled")
  })
})
