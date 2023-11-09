import ErrorMessages from "types/ErrorMessages"
import HO100309 from "../../../../test/test-data/HO100309.json"
import HO100306 from "../../../../test/test-data/HO100306.json"
import hashedPassword from "../../../fixtures/hashedPassword"

describe("ExceptionHandlerPrompt", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.task("clearUsers")
    cy.task("insertUsers", {
      users: [
        {
          username: "Bichard01",
          visibleForces: ["01"],
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

  context("Result Code Qualifier not found - HO100309", () => {
    it("Should display no error prompt if a HO100309 is not raised", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003").click()
      cy.get(".qualifier-code-table").contains("A")
    })

    it("Should display an error prompt when a HO100309 is raised", () => {
      cy.task("insertCourtCasesWithFields", [
        { orgForPoliceFilter: "01", errorCount: 1, triggerCount: 1, hearingOutcome: HO100309.hearingOutcomeXml }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Aid and abet theft").click()

      cy.get(".qualifier-code-table").contains("XX")
      cy.get(".error-prompt-message").contains(ErrorMessages.QualifierCode)

      cy.get("button").contains("Next offence").click()
      cy.get(".error-prompt-message").should("not.exist")

      cy.get("button").contains("Next offence").click()
      cy.get(".error-prompt-message").should("not.exist")
    })

    it("Should not display any error prompts when exceptions are marked as manually resolved", () => {
      cy.task("insertCourtCasesWithFields", [
        { orgForPoliceFilter: "01", errorCount: 1, triggerCount: 1, hearingOutcome: HO100309.hearingOutcomeXml }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Aid and abet theft").click()

      cy.get(".qualifier-code-table").contains("XX")
      cy.get(".qualifier-code-table .error-prompt-message").contains(ErrorMessages.QualifierCode)
      cy.get(".offences-table").contains("YY10XYZXX")
      cy.get(".offences-table .error-prompt-message").contains(ErrorMessages.HO100306ErrorPrompt)

      cy.get("#exceptions-tab").contains("Exceptions").click()
      cy.get("button").contains("Mark as manually resolved").click()
      cy.get("button").contains("Resolve").click()
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Aid and abet theft").click()

      cy.get(".qualifier-code-table .error-prompt-message").should("not.exist")
      cy.get(".offences-table .error-prompt-message").should("not.exist")
    })
  })

  context("Offence code error prompts for HO100306", () => {
    it("Should display no error prompt if HO100306 is not raised", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003").click()
      cy.get(".offences-table").contains("SX03001A")
    })

    it("Should display an error prompt when a HO100306 is raised only on the relevant offence", () => {
      cy.task("insertCourtCasesWithFields", [
        { orgForPoliceFilter: "01", errorCount: 1, triggerCount: 1, hearingOutcome: HO100306.hearingOutcomeXml }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Aid and abet theft").click()

      cy.get(".offences-table").contains("YY10XYZA")
      cy.get(".offences-table .error-prompt-message").contains(ErrorMessages.HO100306ErrorPrompt)

      cy.get("button").contains("Next offence").click()
      cy.get(".offences-table .error-prompt-message").should("not.exist")

      cy.get("button").contains("Next offence").click()
      cy.get(".offences-table .error-prompt-message").should("not.exist")
    })
  })
})
