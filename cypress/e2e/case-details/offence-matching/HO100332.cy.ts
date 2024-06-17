import { loginAndVisit } from "../../../support/helpers"
import HO100332 from "./fixtures/HO100332.json"

describe("Offence matching HO100332", () => {
  const fields = {
    defendantName: "Offence Matching HO100332",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100332,
    errorCount: 2,
    errorReason: "HO100332",
    errorReport: "HO100332||ds:OffenceReasonSequence, HO100332||ds:OffenceReasonSequence"
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

    cy.get("#offences").contains("Section 18 - wounding with intent").click()
  })

  it("displays the offence matcher for offences with a HO100332 exception", () => {
    cy.get("select.offence-matcher").should("exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 2 of 3")
    cy.get("select.offence-matcher").should("exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 3 of 3")
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("loads offence matching information from the AHO PNC query", () => {
    cy.get("select.offence-matcher").children("optgroup").eq(0).should("have.attr", "label", "12/2732/000015R")
    cy.get("select.offence-matcher").children("optgroup").eq(0).contains("option", "001 - OF61016")
  })

  it("disables options that have already been selected", () => {
    cy.get("select.offence-matcher").select("001 - OF61016")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Section 18 - wounding with intent')").eq(1).click()
    cy.get("select").contains("option", "001 - OF61016").should("be.disabled").and("not.be.selected")
  })

  it("loads options that were previously selected", () => {
    cy.get("select.offence-matcher").select("001 - OF61016")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Section 18 - wounding with intent')").eq(1).click()
    cy.get("select.offence-matcher").select("Added in court")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Section 18 - wounding with intent')").eq(0).click()
    cy.get("select").contains("option", "001 - OF61016").should("be.selected")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Section 18 - wounding with intent')").eq(1).click()
    cy.get("select").contains("option", "Added in court").should("be.selected")
  })

  it("allows submission if any offences are unmatched", () => {
    cy.get("button#submit").should("be.enabled")

    cy.get("select.offence-matcher").select("001 - OF61016")
    cy.get("button#submit").should("be.enabled")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Section 18 - wounding with intent')").eq(1).click()
    cy.get("select.offence-matcher").select("Added in court")
    cy.get("button#submit").should("be.enabled")
  })

  it("allows submission if all offences are matched", () => {
    cy.get("button#submit").should("be.enabled")

    cy.get("select.offence-matcher").select("001 - OF61016")
    cy.get("button#submit").should("be.enabled")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Section 18 - wounding with intent')").eq(1).click()
    cy.get("select.offence-matcher").select("002 - OF61016")
    cy.get("button#submit").should("be.enabled")
  })

  it("sends correct offence matching amendments on submission", () => {
    cy.get("select.offence-matcher").select("001 - OF61016")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Section 18 - wounding with intent')").eq(1).click()
    cy.get("select.offence-matcher").select("002 - OF61016")

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
          { offenceIndex: 1, value: 2 }
        ],
        offenceCourtCaseReferenceNumber: [
          { offenceIndex: 0, value: "12/2732/000015R" },
          { offenceIndex: 1, value: "12/2732/000016T" }
        ]
      })
  })

  describe("when using the exception panel to navigate between exceptions", () => {
    it("has the correct values for the select dropdowns", () => {
      cy.get("select.offence-matcher").should("have.value", null)
      cy.get("select.offence-matcher").select("001 - OF61016")
      cy.get("select.offence-matcher").should("have.value", "1-12/2732/000015R")
      cy.get("select.offence-matcher").find(":selected").contains("001 - OF61016")

      cy.get(".exception-location").contains("Offence 2").click()

      cy.get("select.offence-matcher").should("have.value", null)
      cy.get("select.offence-matcher").find(":selected").should("not.have.text", "001 - OF61016")
      cy.get("select.offence-matcher").find(":selected").should("have.text", "Select an offence")

      cy.get(".exception-location").contains("Offence 1").click()

      cy.get("select.offence-matcher").should("have.value", "1-12/2732/000015R")

      cy.get(".exception-location").contains("Offence 2").click()

      cy.get("select.offence-matcher").select("002 - OF61016")
      cy.get("select.offence-matcher").should("have.value", "2-12/2732/000016T")

      cy.get(".exception-location").contains("Offence 1").click()

      cy.get("select.offence-matcher").should("have.value", "1-12/2732/000015R")

      cy.get(".exception-location").contains("Offence 2").click()

      cy.get("select.offence-matcher").should("have.value", "2-12/2732/000016T")
    })
  })

  describe("displays correct badges for offences", () => {
    it("on submitted cases", () => {
      cy.get("select.offence-matcher").select("001 - OF61016")

      cy.get("a").contains("Back to all offences").click()
      cy.get("a:contains('Section 18 - wounding with intent')").eq(1).click()
      cy.get("select.offence-matcher").select("Added in court")

      cy.get("button#submit").click()
      cy.get("button#confirm-submit").click()

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get("#offences").contains("Section 18 - wounding with intent").click()
      cy.contains("Matched PNC offence")
      cy.get("span.moj-badge").contains("MATCHED")

      cy.get("a").contains("Back to all offences").click()
      cy.get("a:contains('Section 18 - wounding with intent')").eq(1).click()
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

      cy.get("a:contains('Section 18 - wounding with intent')").eq(0).click()
      cy.get("span.moj-badge").contains("UNMATCHED")

      cy.get("a").contains("Back to all offences").click()
      cy.get("a:contains('Section 18 - wounding with intent')").eq(1).click()

      cy.get("span.moj-badge").contains("UNMATCHED")
    })
  })
})
