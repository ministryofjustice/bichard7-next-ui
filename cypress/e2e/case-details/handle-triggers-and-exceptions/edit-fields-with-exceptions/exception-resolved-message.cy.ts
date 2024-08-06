import AsnExceptionHO100206 from "../../../../../test/test-data/AsnExceptionHo100206.json"
import multipleEditableFieldsExceptions from "../../../../../test/test-data/multipleEditableFieldsExceptions.json"
import { loginAndVisit } from "../../../../support/helpers"

describe("Exception resolution message", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("displays 'Exceptions Manually resolved' when resolved manually", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("button").contains("Mark as manually resolved").click()
    cy.get("H1").should("have.text", "Resolve Case")
    cy.get('select[name="reason"]').select("PNCRecordIsAccurate")
    cy.get("button").contains("Resolve").click()

    cy.visit("/bichard/court-cases/0")

    cy.get("#exceptions-resolved-tag").should("have.text", "ExceptionsManually Resolved")
  })

  it("displays 'Exceptions Manually resolved' when resolved multiple exceptions manually", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: multipleEditableFieldsExceptions.hearingOutcomeXml,
        updatedHearingOutcome: multipleEditableFieldsExceptions.updatedHearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("button").contains("Mark as manually resolved").click()
    cy.get("H1").should("have.text", "Resolve Case")
    cy.get('select[name="reason"]').select("PNCRecordIsAccurate")
    cy.get("button").contains("Resolve").click()

    cy.visit("/bichard/court-cases/0")

    cy.get("#exceptions-resolved-tag").should("have.text", "ExceptionsManually Resolved")
  })

  it("displays 'Exceptions Submitted' when resubmitted the case", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    cy.get("button").contains("Submit exception(s)").click()

    cy.contains(
      "Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"
    ).should("exist")
    cy.get("button").contains("Submit exception(s)").click()

    cy.get("#exceptions-submitted-tag").should("have.text", "ExceptionsSubmitted")
  })
})
