import AsnExceptionHo100206 from "../../../../test/test-data/AsnExceptionHo100206.json"
import AnnotatedHO from "../../../../test/test-data/AnnotatedHO1.json"
import hashedPassword from "../../../fixtures/hashedPassword"
import { verifyUpdatedMessage } from "../../../support/helpers"

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
        hearingOutcome: AsnExceptionHo100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHo100206.updatedHearingOutcomeXml,
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
        errorCount: 1
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
        hearingOutcome: AsnExceptionHo100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHo100206.updatedHearingOutcomeXml,
        errorCount: 1
      },
      {
        errorStatus: "Resolved",
        errorId: resolvedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHo100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHo100206.updatedHearingOutcomeXml,
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

  it("Should be able to edit ASN field if any exceptions is raised", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get(".moj-badge").contains("Editable Field").should("exist")
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
    cy.get("#asn").type("1101ZD0100000448754K")

    cy.get("button").contains("Submit exception(s)").click()
    cy.get("button").contains("Submit exception(s)").click()

    cy.get(".Defendant-details-table").contains("1101ZD0100000448754K")
    cy.get(".moj-badge").contains("Correction").should("exist")
  })

  it("should display error when invalid ASN is entered", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("#asn").type("asdf")

    cy.get(".Defendant-details-table").contains("Invalid ASN format")
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

    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
  })

  it("Should not be able to edit ASN field if case is not locked by the current user", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHo100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHo100206.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "Bichard02"
      }
    ])
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
  })
})
