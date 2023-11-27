import nextHearingLocationExceptions from "../../../../test/test-data/NextHearingLocationExceptions.json"
import dummyAho from "../../../../test/test-data/HO100102_1.json"
import hashedPassword from "../../../fixtures/hashedPassword"

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
        errorCount: 1
      }
    ])
  })

  it("Should not be able to edit next hearing location field if there is no exception", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with no exception").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46AM03")
    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
    cy.get("#next-hearing-date").should("not.exist")
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
    cy.get(".moj-badge").contains("Editable Field").should("not.exist")
  })

  it("Should be able to edit field if HO100200 is raised", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B@1EF$1")
    // cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Editable Field")
  })

  it("Should be able to edit field if HO100300 is raised", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "B46AM03")
    // cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Editable Field")
  })

  it("Should be able to edit field if HO100322 is raised", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.contains("td", "Next hearing location").siblings().should("include.text", "")
    // cy.contains("td", "Next hearing location").siblings().get(".moj-badge").contains("Editable Field")
  })
})
