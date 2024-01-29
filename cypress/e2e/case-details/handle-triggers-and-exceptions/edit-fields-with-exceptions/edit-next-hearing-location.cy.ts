import dummyAho from "../../../../../test/test-data/HO100102_1.json"
import nextHearingLocationExceptions from "../../../../../test/test-data/NextHearingLocationExceptions.json"
import hashedPassword from "../../../../fixtures/hashedPassword"
import { submitAndConfirmExceptions, verifyUpdatedMessage } from "../../../../support/helpers"

describe("NextHearingLocation", () => {
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
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "Bichard01"
      }
    ])
  })

  it("Should not be able to edit next hearing location field if there is no exception", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

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

    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Use a motor vehicle on a road / public place without third party insurance").click()
    cy.contains("td", "Next hearing location").should("not.exist")
    cy.get(".moj-badge").contains("Editable Field").should("not.be.visible")
  })

  it("Should be able to edit field if HO100200 is raised", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

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

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Bichard01: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B01EF01")
    cy.contains("Bichard01: Portal Action: Resubmitted Message.")

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
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

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

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Bichard01: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B46DB00")
    cy.contains("Bichard01: Portal Action: Resubmitted Message.")

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
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

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

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Bichard01: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B01EF00")
    cy.contains("Bichard01: Portal Action: Resubmitted Message.")

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
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF00")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()

    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B46DB00")

    submitAndConfirmExceptions()

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Bichard01: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B01EF00")
    cy.contains("Bichard01: Portal Action: Update Applied. Element: nextSourceOrganisation. New Value: B46DB00")
    cy.contains("Bichard01: Portal Action: Resubmitted Message.")

    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: [
        '<ds:OrganisationUnitCode Error="HO100300">B46AM03</ds:OrganisationUnitCode>',
        '<ds:OrganisationUnitCode Error="HO100322" />'
      ],
      updatedMessageHaveContent: [
        "<ds:OrganisationUnitCode>B01EF00</ds:OrganisationUnitCode>",
        "<ds:OrganisationUnitCode>B46DB00</ds:OrganisationUnitCode>"
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
        errorLockedByUsername: "Bichard01"
      },
      {
        errorStatus: "Resolved",
        errorId: resolvedCaseId,
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "Bichard01"
      }
    ])

    cy.login("bichard01@example.com", "password")
    cy.visit(`/bichard/court-cases/${submittedCaseId}`)

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
        errorLockedByUsername: "bichard02"
      }
    ])

    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

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

    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
    cy.contains("td", "Next hearing location").siblings().contains("Editable Field").should("not.exist")
  })

  it("Should not be able to edit next hearing location field when user is not exception-handler", () => {
    cy.task("clearUsers")
    cy.task("insertUsers", {
      users: [
        {
          username: "triggerHandler",
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

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
    cy.contains("td", "Next hearing location").siblings().contains("Editable Field").should("not.exist")
  })
})
