import ErrorMessages from "types/ErrorMessages"
import HO100309 from "../../../../test/test-data/HO100309.json"
import HO100306andHO100251 from "../../../../test/test-data/HO100306andHO100251.json"
import HO200113 from "../../../../test/test-data/HO200113.json"
import HO200114 from "../../../../test/test-data/HO200114.json"

import hashedPassword from "../../../fixtures/hashedPassword"

describe("ExceptionHandlerPrompt", () => {
  const caseWithOffenceQualifierError = 0
  const caseWithOffenceCodeErrors = 1
  const caseWithNoError = 2

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

    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        errorId: caseWithOffenceQualifierError,
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 1,
        hearingOutcome: HO100309.hearingOutcomeXml
      },
      {
        errorId: caseWithOffenceCodeErrors,
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 1,
        hearingOutcome: HO100306andHO100251.hearingOutcomeXml
      },
      {
        errorId: caseWithNoError,
        orgForPoliceFilter: "01"
      }
    ])
  })

  context("Result Code Qualifier not found - HO100309", () => {
    it("Should display no error prompt if a HO100309 is not raised", () => {
      cy.login("bichard01@example.com", "password")
      cy.visit(`/bichard/court-cases/${caseWithNoError}`)

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003").click()
      cy.get(".qualifier-code-table").contains("A")
    })

    it("Should display an error prompt when a HO100309 is raised", () => {
      cy.login("bichard01@example.com", "password")
      cy.visit(`/bichard/court-cases/${caseWithOffenceQualifierError}`)

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Aid and abet theft").click()

      cy.get(".qualifier-code-table").contains("XX")
      cy.get('[class*="errorPromptMessage"]').contains(ErrorMessages.QualifierCode)

      cy.get("button").contains("Next offence").click()
      cy.get('[class*="errorPromptMessage"]').should("not.exist")

      cy.get("button").contains("Next offence").click()
      cy.get('[class*="errorPromptMessage"]').should("not.exist")
    })

    it("Should not display any error prompts when exceptions are marked as manually resolved", () => {
      cy.login("bichard01@example.com", "password")
      cy.visit(`/bichard/court-cases/${caseWithOffenceQualifierError}`)

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Aid and abet theft").click()

      cy.get(".qualifier-code-table").contains("XX")
      cy.get(".qualifier-code-table [class*='errorPromptMessage']").contains(ErrorMessages.QualifierCode)
      cy.get(".offences-table").contains("YY10XYZXX")
      cy.get(".offences-table [class*='errorPromptMessage']").contains(ErrorMessages.HO100306ErrorPrompt)

      cy.get("#exceptions-tab").contains("Exceptions").click()
      cy.get("button").contains("Mark as manually resolved").click()
      cy.get("button").contains("Resolve").click()
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Aid and abet theft").click()

      cy.get(".qualifier-code-table [class*='errorPromptMessage']").should("not.exist")
      cy.get(".offences-table [class*='errorPromptMessage']").should("not.exist")
    })
  })

  context("Offence code error prompts for OffenceCode errors", () => {
    beforeEach(() => {
      cy.login("bichard01@example.com", "password")
      cy.visit(`/bichard/court-cases/${caseWithOffenceCodeErrors}`)
    })

    it("Should display no error prompt if HO100306 or HO100251 are not raised", () => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Offence with no errors").click()
      cy.get(".offences-table").contains("RT88191")
      cy.get(".offences-table [class*='errorPromptMessage']").should("not.exist")
    })

    it("Should display an error prompt when a HO100306 is raised on a national offence", () => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("National Offence with Offence Code not found exception").click()

      cy.get(".offences-table").contains("TH68XYZ")
      cy.get(".offences-table [class*='errorPromptMessage']").contains(ErrorMessages.HO100306ErrorPrompt)

      cy.get("a.govuk-back-link").contains("Back to all offences").click()
      cy.get(".govuk-link").contains("Offence with no errors").click()
      cy.get(".offences-table [class*='errorPromptMessage']").should("not.exist")
    })

    it("Should display an error prompt when a HO100251 is raised on a national offence", () => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("National Offence with Offence Code not recognised exception").click()

      cy.get(".offences-table").contains("TH68$$$")
      cy.get(".offences-table [class*='errorPromptMessage']").contains(ErrorMessages.HO100251ErrorPrompt)
    })

    it("Should display an error prompt when a HO100306 is raised on a local offence", () => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Local Offence with Offence Code not found exception").click()

      cy.get(".offences-table").contains("ABC00")
      cy.get(".offences-table [class*='errorPromptMessage']").contains(ErrorMessages.HO100306ErrorPrompt)
    })

    it("Should display an error prompt when a HO100251 is raised on a local offence", () => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Local Offence with Offence Code not recognised exception").click()

      cy.get(".offences-table").contains("$$$$$$")
      cy.get(".offences-table [class*='errorPromptMessage']").contains(ErrorMessages.HO100251ErrorPrompt)
    })

    it("Should not display any error prompts when exceptions are marked as manually resolved", () => {
      cy.get("#exceptions-tab").contains("Exceptions").click()
      cy.get("button").contains("Mark as manually resolved").click()
      cy.get("button").contains("Resolve").click()
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()

      cy.get(".govuk-link").contains("National Offence with Offence Code not found exception").click()
      cy.get(".qualifier-code-table [class*='errorPromptMessage']").should("not.exist")
      cy.get(".offences-table [class*='errorPromptMessage']").should("not.exist")
      cy.get("a.govuk-back-link").contains("Back to all offences").click()

      cy.get(".govuk-link").contains("National Offence with Offence Code not recognised exception").click()
      cy.get(".qualifier-code-table [class*='errorPromptMessage']").should("not.exist")
      cy.get(".offences-table [class*='errorPromptMessage']").should("not.exist")
      cy.get("a.govuk-back-link").contains("Back to all offences").click()

      cy.get(".govuk-link").contains("Local Offence with Offence Code not found exception").click()
      cy.get(".qualifier-code-table [class*='errorPromptMessage']").should("not.exist")
      cy.get(".offences-table [class*='errorPromptMessage']").should("not.exist")
      cy.get("a.govuk-back-link").contains("Back to all offences").click()

      cy.get(".govuk-link").contains("Local Offence with Offence Code not recognised exception").click()
      cy.get(".qualifier-code-table [class*='errorPromptMessage']").should("not.exist")
      cy.get(".offences-table [class*='errorPromptMessage']").should("not.exist")
      cy.get("a.govuk-back-link").contains("Back to all offences").click()
    })
  })

  context.only("ASN error prompt", () => {
    it("Should not display an error prompt when a HO200113 is not raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          errorCount: 1,
          triggerCount: 1
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get(".Defendant-details-table").contains("1101ZD0100000448754K")
      cy.get(".error-prompt-message").should("not.exist")
    })

    it("Should display an error prompt when a HO200113 is raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          errorCount: 1,
          triggerCount: 1,
          hearingOutcome: HO200113.hearingOutcomeXml
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get(".error-prompt").contains("2300000000000942133G")
      cy.get(".error-prompt").contains(ErrorMessages.AsnUneditable)
    })

    it("Should not display an error prompt when a HO200114 is not raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          errorCount: 1,
          triggerCount: 1
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get(".Defendant-details-table").contains("1101ZD0100000448754K")
      cy.get(".error-prompt-message").should("not.exist")
    })

    it("Should display an error prompt when a HO200114 is raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          errorCount: 1,
          triggerCount: 1,
          hearingOutcome: HO200114.hearingOutcomeXml
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get(".error-prompt").contains("2300000000000532316D")
      cy.get(".error-prompt").contains(ErrorMessages.AsnUneditable)
    })
  })
})
