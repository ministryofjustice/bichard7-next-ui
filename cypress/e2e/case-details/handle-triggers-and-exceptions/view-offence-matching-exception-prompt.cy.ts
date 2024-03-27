import ExceptionHO100304 from "../../../../test/test-data/HO100304.json"
import NextHearingDateExceptions from "../../../../test/test-data/NextHearingDateExceptions.json"
import hashedPassword from "../../../fixtures/hashedPassword"

describe("View offence matching exception prompts", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.task("clearUsers")
    cy.task("insertUsers", {
      users: [
        {
          username: "Bichard01",
          visibleForces: [1],
          forenames: "Bichard Test User",
          surname: "01",
          email: "bichard01@example.com",
          password: hashedPassword
        }
      ],
      userGroups: ["B7NewUI_grp", "B7GeneralHandler_grp"]
    })
  })

  it("Should not display an error prompt when HO100304 is not raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: NextHearingDateExceptions.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "Bichard01"
      }
    ])

    cy.login("bichard01@example.com", "password")
    cy.visit(`/bichard/court-cases/0`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()

    cy.get(".offences-table").contains("td", "Matched PNC offence").should("not.exist")
  })

  it("Should display an error prompt when HO100304 is raised", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: ExceptionHO100304.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "Bichard01"
      }
    ])

    cy.login("bichard01@example.com", "password")
    cy.visit(`/bichard/court-cases/0`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Theft of pedal cycle").click()

    cy.get(".offences-table")
      .contains("td", "Matched PNC offence")
      .should(
        "include.text",
        "If offences appear to match, then check if offence dates match also. After this manually result on the PNC, to deal with error."
      )
  })
})
