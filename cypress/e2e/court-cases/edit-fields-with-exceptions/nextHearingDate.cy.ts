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
      // cy.get(".govuk-link").contains("Aid and abet theft").click()
      // cy.get(".qualifierCodeTable").contains("XX")
      // cy.get(".error-prompt-message").contains(ErrorMessages.QualifierCode)
    })
  })
})
