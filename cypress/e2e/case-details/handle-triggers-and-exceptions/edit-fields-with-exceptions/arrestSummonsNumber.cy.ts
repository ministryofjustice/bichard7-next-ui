import AnnotatedHO from "../../../../../test/test-data/AnnotatedHO1.json"
import AsnExceptionHO100206 from "../../../../../test/test-data/AsnExceptionHo100206.json"
import AsnExceptionHO100321 from "../../../../../test/test-data/AsnExceptionHo100321.json"
import ExceptionHO100239 from "../../../../../test/test-data/HO100239_1.json"
import hashedPassword from "../../../../fixtures/hashedPassword"
import { verifyUpdatedMessage } from "../../../../support/helpers"

describe("ASN", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.task("clearUsers")
    cy.task("insertUsers", {
      users: [
        {
          username: "Bichard01",
          visibleForces: ["001"],
          forenames: "Bichard Test User",
          surname: "01",
          email: "bichard01@example.com",
          password: hashedPassword
        }
      ],
      userGroups: ["B7NewUI_grp", "B7GeneralHandler_grp"]
    })
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "Bichard01"
      }
    ])
  })

  it("Should not be able to edit ASN field when there is no exception", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AnnotatedHO.hearingOutcomeXml,
        errorCount: 0,
        errorStatus: null
      }
    ])

    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
  })

  it("Should not be able to edit ASN field when the case isn't in 'unresolved' state", () => {
    const submittedCaseId = 0
    const resolvedCaseId = 1
    cy.task("insertCourtCasesWithFields", [
      {
        errorStatus: "Submitted",
        errorId: submittedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1
      },
      {
        errorStatus: "Resolved",
        errorId: resolvedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    cy.login("bichard01@example.com", "password")
    cy.visit(`/bichard/court-cases/${submittedCaseId}`)

    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
    cy.get("#asn").should("not.exist")

    cy.visit(`/bichard/court-cases/${resolvedCaseId}`)

    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
    cy.get("#asn").should("not.exist")
  })

  it("Should be able to edit ASN field if any exceptions are raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: ExceptionHO100239.hearingOutcomeXml,
        updatedHearingOutcome: ExceptionHO100239.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "Bichard01"
      }
    ])

    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get(".moj-badge").contains("Editable Field").should("exist")
    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    cy.get("button").contains("Submit exception(s)").click()

    cy.contains(
      "Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"
    ).should("exist")
    cy.get("button").contains("Submit exception(s)").click()

    cy.contains("Bichard01: Portal Action: Update Applied. Element: asn. New Value: 1101ZD0100000448754K")
    cy.contains("Bichard01: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>AAAAAAAAAAAAAAAAAAAA</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
    })
  })

  it("Should validate ASN correction and save to updated message in the database", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: ExceptionHO100239.hearingOutcomeXml,
        updatedHearingOutcome: ExceptionHO100239.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "Bichard01"
      }
    ])

    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get(".moj-badge").contains("Editable Field").should("exist")
    // error message should be displayed when ASN is not entered
    cy.get("#asn").type("AAAAAAAAAAAAAAAAAAAA")
    cy.get("#event-name-error").should("exist")
    // Submit exception(s) button should be disabled
    cy.get("button").contains("Submit exception(s)").should("be.disabled")
    // Save correction button should be disabled
    cy.get("button").contains("Save correction").should("be.disabled")
    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000410836V")
    // Submit exception(s) button should be enabled
    cy.get("button").contains("Submit exception(s)").should("be.enabled")
    // Save correction button should be enabled
    cy.get("#event-name-error").should("not.exist")

    cy.get("button").contains("Save correction").click()

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Unresolved" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000410836V</br7:ArrestSummonsNumber>"]
    })
  })
  it("Should be able to edit ASN field if HO100206 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "Bichard01"
      }
    ])

    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get(".moj-badge").contains("Editable Field").should("exist")
    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    cy.get("button").contains("Submit exception(s)").click()

    cy.contains(
      "Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"
    ).should("exist")
    cy.get("button").contains("Submit exception(s)").click()

    cy.contains("Bichard01: Portal Action: Update Applied. Element: asn. New Value: 1101ZD0100000448754K")
    cy.contains("Bichard01: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>AAAAAAAAAAAAAAAAAAAA</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
    })
  })

  it("Should be able to edit ASN field if HO100321 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "Bichard01"
      }
    ])

    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get(".moj-badge").contains("Editable Field").should("exist")
    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    cy.get("button").contains("Submit exception(s)").click()

    cy.contains(
      "Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"
    ).should("exist")
    cy.get("button").contains("Submit exception(s)").click()

    cy.contains("Bichard01: Portal Action: Update Applied. Element: asn. New Value: 1101ZD0100000448754K")
    cy.contains("Bichard01: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>AAAAAAAAAAAAAAAAAAAA</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
    })
  })

  it("should display the updated ASN after submission along with CORRECTION badge", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get(".moj-badge").contains("Correction").should("not.exist")
    cy.get(".Defendant-details-table").contains("AAAAAAAAAAAAAAAAAAA")
    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    cy.get("button").contains("Submit exception(s)").click()
    cy.get("button").contains("Submit exception(s)").click()

    cy.get(".Defendant-details-table").contains("1101ZD0100000448754K")
  })

  it("should display error when invalid ASN is entered", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("#asn").type("asdf")

    cy.get(".Defendant-details-table").contains("Invalid ASN format")
  })

  it("Should not be able to edit ASN field if case is not locked by the current user", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "Bichard02"
      }
    ])
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
  })

  it("Should not be able to edit ASN field if user is not exception-handler", () => {
    cy.task("clearUsers")
    cy.task("insertUsers", {
      users: [
        {
          username: "Bichard01",
          visibleForces: ["001"],
          forenames: "triggerHandler Test User",
          surname: "01",
          email: "triggerhandler@example.com",
          password: hashedPassword
        }
      ],
      userGroups: ["B7NewUI_grp", "B7TriggerHandler_grp"]
    })
    cy.login("triggerhandler@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get(".moj-badge").should("not.exist")
  })
})
