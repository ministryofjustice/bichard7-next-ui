import nextHearingDateExceptions from "../../../../test/test-data/NextHearingDateExceptions.json"
import hashedPassword from "../../../fixtures/hashedPassword"

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
  })

  context("Edit next hearing date", () => {
    it("Should be able to edit field if HO100102 is raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
          updatedHearingOutcome: nextHearingDateExceptions.updatedHearingOutcomeXml,
          errorCount: 1
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
      cy.contains("td", "Next hearing date").siblings().should("include.text", "false")

      cy.get("a.govuk-back-link").contains("Back to all offences").click()
      cy.get(".govuk-link")
        .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
        .click()
      cy.contains("td", "Next hearing date").siblings().should("include.text", "")

      cy.get("a.govuk-back-link").contains("Back to all offences").click()
      cy.get(".govuk-link").contains("Offence with no exceptions").click()
      cy.contains("td", "Next hearing date").should("not.exist")
    })
  })
})
