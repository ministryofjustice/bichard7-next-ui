import CourtCase from "../../../../src/services/entities/CourtCase"
import nextHearingDateExceptions from "../../../../test/test-data/NextHearingDateExceptions.json"
import dummyAho from "../../../../test/test-data/error_list_aho.json"
import hashedPassword from "../../../fixtures/hashedPassword"

const verifyUpdates = (args: {
  expectedCourtCase: Partial<CourtCase>
  updatedMessageHaveContent?: string[]
  updatedMessageNotHaveContent?: string[]
}) => {
  cy.task("getCourtCaseById", { caseId: args.expectedCourtCase.errorId }).then((result) => {
    const updatedCase = result as CourtCase
    expect(updatedCase.errorStatus).equal(args.expectedCourtCase.errorStatus)

    if (args.updatedMessageNotHaveContent) {
      args.updatedMessageNotHaveContent.forEach((oldValue) => {
        expect(updatedCase.updatedHearingOutcome).not.match(new RegExp(oldValue))
      })
    }

    if (args.updatedMessageHaveContent) {
      args.updatedMessageHaveContent.forEach((update) => {
        expect(updatedCase.updatedHearingOutcome).match(new RegExp(update))
      })
    }
  })
}

describe("NextHearingDate", () => {
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
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.updatedHearingOutcomeXml,
        errorCount: 1
      }
    ])
  })

  it("Should not be able to edit next hearing date field there is no exception", () => {
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
    cy.get(".govuk-link").contains("Burglary other than dwelling with intent to steal").click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "01/02/2008")
    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
    cy.get("#next-hearing-date").should("not.exist")
  })

  it("Shouldn't see editable next hearing date when it has no value", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with no exceptions").click()
    cy.contains("td", "Next hearing date").should("not.exist")
    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
  })

  it("Should be able to edit field if HO100102 is raised", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "false")
    cy.contains("td", "Next hearing date").siblings().get(".moj-badge").contains("Editable Field")
    cy.get("#next-hearing-date").type("2024-01-01")

    cy.get("button").contains("Submit exception(s)").click()

    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Bichard01: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2024-01-01")
    cy.contains("Bichard01: Portal Action: Resubmitted Message.")

    verifyUpdates({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<ds:NextHearingDate>false</ds:NextHearingDate>"],
      updatedMessageHaveContent: ["<ds:NextHearingDate>2024-01-01</ds:NextHearingDate>"]
    })
  })

  it("Should be able to edit field if HO100323 is raised", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
      .click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "")
    cy.get("#next-hearing-date").type("2023-12-24")
    cy.get("button").contains("Submit exception(s)").click()

    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Bichard01: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2023-12-24")
    cy.contains("Bichard01: Portal Action: Resubmitted Message.")

    verifyUpdates({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<ds:NextHearingDate />"],
      updatedMessageHaveContent: ["<ds:NextHearingDate>2023-12-24</ds:NextHearingDate>"]
    })
  })

  it("Should be able to edit and submit multiple next hearing dates", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.get("#next-hearing-date").type("2024-01-01")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
      .click()
    cy.get("#next-hearing-date").type("2023-12-24")

    cy.get("button").contains("Submit exception(s)").click()

    cy.location().should((loc) => {
      expect(loc.href).to.contain("?resubmitCase=true")
    })

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Bichard01: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2024-01-01")
    cy.contains("Bichard01: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2023-12-24")
    cy.contains("Bichard01: Portal Action: Resubmitted Message.")

    verifyUpdates({
      expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
      updatedMessageNotHaveContent: ["<ds:NextHearingDate>false</ds:NextHearingDate>", "<ds:NextHearingDate />"],
      updatedMessageHaveContent: [
        "<ds:NextHearingDate>2024-01-01</ds:NextHearingDate>",
        "<ds:NextHearingDate>2023-12-24</ds:NextHearingDate>"
      ]
    })
  })
})
