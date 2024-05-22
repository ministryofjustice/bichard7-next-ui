import { loginAndVisit } from "../../../support/helpers"
import HO100310 from "./fixtures/HO100310.json"

describe("Offence matching HO100310", () => {
  const fields = {
    defendantName: "Offence Matching HO100310",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100310,
    errorCount: 2
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

  it("displays the offence matcher for offences with a HO100310 exception", () => {
    cy.get("select.offence-matcher").should("exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 2 of 5")
    cy.get("select.offence-matcher").should("not.exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 3 of 5")
    cy.get("select.offence-matcher").should("not.exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 4 of 5")
    cy.get("select.offence-matcher").should("exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 5 of 5")
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("loads offence matching information from the AHO PNC query", () => {
    cy.get("select.offence-matcher").children("optgroup").eq(0).should("have.attr", "label", "97/1626/008395Q")
    cy.get("select.offence-matcher").children("optgroup").eq(0).contains("option", "TH68006")
  })

  it("disables options that have already been selected", () => {
    cy.get("select.offence-matcher").select("001 - TH68006")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select").contains("option", "TH68006").should("be.disabled").and("not.be.selected")
  })

  it("loads options that were previously selected", () => {
    cy.get("select.offence-matcher").select("001 - TH68006")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select.offence-matcher").select("Added in court")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(0).click()
    cy.get("select").contains("option", "TH68006").should("be.selected")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select").contains("option", "Added in court").should("be.selected")
  })

  it("prevents submission if any offences are unmatched", () => {
    cy.get("button#submit").should("be.disabled")

    cy.get("select.offence-matcher").select("001 - TH68006")
    cy.get("button#submit").should("be.disabled")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select.offence-matcher").select("Added in court")
    cy.get("button#submit").should("be.enabled")
  })

  it("sends correct offence matching amendments on submission", () => {
    cy.get("select.offence-matcher").select("001 - TH68006")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select.offence-matcher").select("Added in court")

    cy.intercept("POST", "/bichard/court-cases/0/submit").as("submit")
    cy.get("button#submit").click()
    cy.wait("@submit")
    cy.get("@submit")
      .its("request.body")
      .then((body) => {
        const json = Object.fromEntries(new URLSearchParams(body))
        const { offenceReasonSequence, offenceCourtCaseReferenceNumber } = JSON.parse(json.amendments)
        return { offenceReasonSequence, offenceCourtCaseReferenceNumber }
      })
      .should("deep.equal", {
        offenceReasonSequence: [
          { offenceIndex: 0, value: 1 },
          { offenceIndex: 3, value: 0 }
        ], // TODO: determine whether CCRN for Added In Court offences should include a value
        offenceCourtCaseReferenceNumber: [{ offenceIndex: 0, value: "97/1626/008395Q" }, { offenceIndex: 3 }]
      })
  })

  describe("displays correct badges for offences", () => {
    it("on submitted cases", () => {
      cy.get("select.offence-matcher").select("001 - TH68006")

      cy.get("a").contains("Back to all offences").click()
      cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
      cy.get("select.offence-matcher").select("Added in court")

      cy.get("button#submit").click()
      cy.get("button#confirm-submit").click()

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get("#offences").contains("Theft of pedal cycle").click()
      cy.contains("Matched PNC offence")
      cy.get("span.moj-badge").contains("MATCHED")

      cy.get("a").contains("Back to all offences").click()
      cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
      cy.contains("Matched PNC offence")
      cy.get("span.moj-badge").contains("ADDED IN COURT")
    })

    it("on cases locked to someone else", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          ...fields,
          errorLockedByUsername: "ExceptionHandler"
        }
      ])

      cy.visit("/bichard/court-cases/0")
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()

      cy.get("a:contains('Theft of pedal cycle')").eq(0).click()
      cy.get("span.moj-badge").contains("UNMATCHED")

      cy.get("a").contains("Back to all offences").click()
      cy.get("a:contains('Theft of pedal cycle')").eq(1).click()

      cy.get("span.moj-badge").contains("UNMATCHED")
    })
  })

  describe("renders based on feature flag value for user", () => {
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
})
