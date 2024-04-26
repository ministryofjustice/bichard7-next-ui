import dummyAho from "../../../../../test/test-data/HO100102_1.json"
import nextHearingLocationExceptions from "../../../../../test/test-data/NextHearingLocationExceptions.json"
import { loginAndVisit, submitAndConfirmExceptions, verifyUpdatedMessage } from "../../../../support/helpers"

describe("NextHearingLocation", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
  })

  it("Should not be able to edit next hearing location field if there is no exception", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with no exception").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46AM03")
    cy.contains("td", "Next hearing location").siblings().contains("Editable Field").should("not.exist")
  })

  it("Shouldn't see next hearing location field when it has no value", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: dummyAho.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Use a motor vehicle on a road / public place without third party insurance").click()
    cy.contains("td", "Next hearing location").should("not.exist")
    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
  })

  it("Should be able to edit field if HO100200 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
        updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.get("#next-hearing-location").should("have.value", "B@1EF$1")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Editable Field")
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF01")

    submitAndConfirmExceptions()

    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B01EF01")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ['<ds:OrganisationUnitCode Error="HO100200">B@1EF$1</ds:OrganisationUnitCode>'],
      updatedMessageHaveContent: ["<ds:OrganisationUnitCode>B01EF01</ds:OrganisationUnitCode>"]
    })

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B01EF01")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")
  })

  it("Should be able to edit field if HO100300 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100300,
        updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100300,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46AM03")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Editable Field")
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B46DB00")

    submitAndConfirmExceptions()

    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B46DB00")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ['<ds:OrganisationUnitCode Error="HO100300">B46AM03</ds:OrganisationUnitCode>'],
      updatedMessageHaveContent: ["<ds:OrganisationUnitCode>B46DB00</ds:OrganisationUnitCode>"]
    })

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46AM03")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46DB00")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")
  })

  it("Should be able to edit field if HO100322 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100322,
        updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100322,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Editable Field")
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF00")

    submitAndConfirmExceptions()

    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B01EF00")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ['<ds:OrganisationUnitCode Error="HO100322" />'],
      updatedMessageHaveContent: ["<ds:OrganisationUnitCode>B01EF00</ds:OrganisationUnitCode>"]
    })

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B01EF00")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")
  })

  it("Should be able to edit multiple next hearing locations", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF00")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()

    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B21XA00")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()

    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B46DB00")

    submitAndConfirmExceptions()

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B01EF00")
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B46DB00")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: [
        '<ds:OrganisationUnitCode Error="HO100300">B46AM03</ds:OrganisationUnitCode>',
        '<ds:OrganisationUnitCode Error="HO100322" />',
        '<ds:OrganisationUnitCode Error="HO100200">B@1EF$1</ds:OrganisationUnitCode>'
      ],
      updatedMessageHaveContent: [
        "<ds:OrganisationUnitCode>B01EF00</ds:OrganisationUnitCode>",
        "<ds:OrganisationUnitCode>B46DB00</ds:OrganisationUnitCode>",
        "<ds:OrganisationUnitCode>B21XA00</ds:OrganisationUnitCode>"
      ]
    })

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46AM03")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B01EF00")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46DB00")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Initial Value")
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B21XA00")
    cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Correction")
  })

  it("Should not be able to edit next hearing location field when the case isn't in 'unresolved' state", () => {
    const submittedCaseId = 0
    const resolvedCaseId = 1
    cy.task("insertCourtCasesWithFields", [
      {
        errorStatus: "Submitted",
        errorId: submittedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      },
      {
        errorStatus: "Resolved",
        errorId: resolvedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit(`/bichard/court-cases/${submittedCaseId}`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().contains("Editable Field").should("not.exist")

    cy.visit(`/bichard/court-cases/${resolvedCaseId}`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.contains("td", "Next hearing location").siblings().contains("Editable Field").should("not.exist")
  })

  it("Should not be able to edit next hearing location field when exception is not locked by current user", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "BichardForce02"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
    cy.contains("td", "Next hearing location").siblings().contains("Editable Field").should("not.exist")
  })

  it("Should not be able to edit next hearing location field when phase is not hearing outcome", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        phase: 2
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
    cy.contains("td", "Next hearing location").siblings().contains("Editable Field").should("not.exist")
  })

  it("Should not be able to edit next hearing location field when user is not exception-handler", () => {
    loginAndVisit("TriggerHandler", "/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
    cy.contains("td", "Next hearing location").siblings().contains("Editable Field").should("not.exist")
  })

  context("Save correction button", () => {
    it("Should be enabled when valid value is entered", () => {
      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("B43UY00")

      cy.get("#save-next-hearing-location").should("be.enabled")
    })

    it("Should be disabled when no value is entered", () => {
      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
      cy.get("#next-hearing-location").clear()
      cy.get("#save-next-hearing-location").should("be.disabled")
    })

    it("Should be disabled when invalid value is entered", () => {
      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("B01")

      cy.get("#save-next-hearing-location").should("be.disabled")
    })

    it("Should be disabled when whitespace is entered", () => {
      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("      ")

      cy.get("#save-next-hearing-location").should("be.disabled")
    })

    it("Should be enabled when a value different from the previous one is entered", () => {
      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("B21XA00")

      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("B63AD00")

      cy.get("#save-next-hearing-location").should("be.enabled")
    })

    it("Should be disabled when same value as the previous one is entered", () => {
      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("B21XA00")

      cy.get("#save-next-hearing-location").click()

      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("B21XA00")

      cy.get("#save-next-hearing-location").should("be.disabled")
    })
  })
})
