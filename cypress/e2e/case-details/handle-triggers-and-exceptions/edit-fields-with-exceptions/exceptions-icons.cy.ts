import AsnExceptionHO100206 from "../../../../../test/test-data/AsnExceptionHo100206.json"
import AsnExceptionHO100321 from "../../../../../test/test-data/AsnExceptionHo100321.json"
import nextHearingDateAndLocationExceptions from "../../../../../test/test-data/NextHearingDateAndLocationExceptions.json"
import nextHearingDateExceptions from "../../../../../test/test-data/NextHearingDateExceptions.json"
import nextHearingLocationExceptions from "../../../../../test/test-data/NextHearingLocationExceptions.json"
import { clickTab, loginAndVisit, submitAndConfirmExceptions } from "../../../../support/helpers"

describe("Tabs exceptions icons", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  describe("ASN exception", () => {
    it("Should display 1 next to Defendant tab text when HO100206 is raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
          updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler"
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1")
      cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("1").should("not.exist")
    })

    it("Should display 1 next to Defendant tab text when HO100321 is raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
          updatedHearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler"
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1")
      cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("1").should("not.exist")
    })

    it("Should display checkmark icon next to Defendant tab text when asn exception is resolved", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
          updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler"
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get("#asn").clear()
      cy.get("#asn").type("1101ZD0100000448754K")
      cy.get("#save-asn").click()

      submitAndConfirmExceptions()

      cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(0).find(".checkmark-icon").should("exist")
    })

    it("Should not display any icon numbers when exceptionsEnabled is false for user", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
          updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler"
        }
      ])

      loginAndVisit("NoExceptionsFeatureFlag", "/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1").should("not.exist")
    })
  })

  describe("Next-hearing-date-exceptions", () => {
    describe("Exceptions icon", () => {
      ;[
        nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        nextHearingDateExceptions.hearingOutcomeXmlHO100323
      ].forEach((exception) => {
        it("Should display 1 next to the Offences tab text when either of the next-hearing-date exceptions is raised", () => {
          cy.task("insertCourtCasesWithFields", [
            {
              orgForPoliceFilter: "01",
              hearingOutcome: exception,
              updatedHearingOutcome: exception,
              errorCount: 1
            }
          ])

          loginAndVisit("/bichard/court-cases/0")

          cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1")
          cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("1").should("not.exist")
        })
      })
    })

    it("Should display 2 next to the Offences tab text when HO100102 and HO100323 are raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102andHO100323,
          updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102andHO100323,
          errorCount: 1
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("2")
      cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("2").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("2").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("2").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("2").should("not.exist")
    })

    it("Should display checkmark icon next to Offences tab text when next-hearing-date exception is resolved", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
          updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
          errorCount: 1
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("exist")
      clickTab("Offences")
      cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
      cy.get("#next-hearing-date").type("2026-01-01")

      submitAndConfirmExceptions()

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(3).find(".checkmark-icon").should("exist")
    })

    it("Should display checkmark icon next to Offences tab text when multiple next-hearing-date exceptions are resolved", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102andHO100323,
          updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102andHO100323,
          errorCount: 1
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("2").should("exist")
      clickTab("Offences")

      cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
      cy.get("#next-hearing-date").type("2026-01-01")

      cy.get("button").contains("Next offence").click()
      cy.get("#next-hearing-date").type("2027-01-01")

      submitAndConfirmExceptions()

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("2").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(3).find(".checkmark-icon").should("exist")
    })

    it("Should not display any icon numbers when exceptionsEnabled is false for user", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
          updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler"
        }
      ])

      loginAndVisit("NoExceptionsFeatureFlag", "/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("3").should("not.exist")
    })
  })

  describe("Next-hearing-location", () => {
    describe("Exceptions icon", () => {
      ;[
        nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
        nextHearingLocationExceptions.hearingOutcomeXmlHO100300,
        nextHearingLocationExceptions.hearingOutcomeXmlHO100322
      ].forEach((exception) => {
        it("Should display 1 next to the Offences tab text when either of the next-hearing-location exceptions is raised", () => {
          cy.task("insertCourtCasesWithFields", [
            {
              orgForPoliceFilter: "01",
              hearingOutcome: exception,
              updatedHearingOutcome: exception,
              errorCount: 1
            }
          ])

          loginAndVisit("/bichard/court-cases/0")

          cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1")
          cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("1").should("not.exist")
        })
      })
    })

    it("Should display 3 next to the Offences tab text when HO100200, HO100300, or HO100322 are raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
          updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler"
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("3")
      cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("3").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("3").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("3").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("3").should("not.exist")
    })

    it("Should display checkmark icon next to Offences tab text when next-hearing-location exception is resolved", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
          updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
          errorCount: 1
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("exist")
      clickTab("Offences")

      cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("B01EF01")

      submitAndConfirmExceptions()

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(3).find(".checkmark-icon").should("exist")
    })

    it("Should display checkmark icon next to Offences tab text when multiple next-hearing-location exceptions are resolved", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
          updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler"
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("3").should("exist")
      clickTab("Offences")

      cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("B01EF01")

      cy.get("button").contains("Next offence").click()
      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("B63AD00")

      cy.get("button").contains("Next offence").click()
      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("C42BS00")

      submitAndConfirmExceptions()

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("3").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(3).find(".checkmark-icon").should("exist")
    })

    it("Should not display any icon numbers when exceptionsEnabled is false for user", () => {
      cy.task("clearCourtCases")

      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
          updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler"
        }
      ])

      loginAndVisit("NoExceptionsFeatureFlag", "/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("3").should("not.exist")
    })
  })
})

describe("Offences exceptions icons", () => {
  it("Should display a warning icon in front of the first offence when exception is raised and checkmark icon when exception is resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(1)").find(".checkmark-icon").should("not.exist")
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.get("#next-hearing-date").type("2028-01-01")

    submitAndConfirmExceptions()

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(1)").find(".checkmark-icon").should("exist")
  })

  it("Should display warning icons for the first and second offences when exceptions are raised. Once the exceptions for these offences are resolved, replace the warning icons with checkmark icons", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.updatedHearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(1) td:nth-child(1) .warning-icon").should("have.length", 1)

    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .warning-icon").should("have.length", 1)

    cy.get("#offences tbody tr:nth-child(3)").find(".warning-icon").should("not.exist")

    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.get("#next-hearing-date").type("2026-01-01")

    cy.get("button").contains("Next offence").click()

    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF01")
    cy.get("#next-hearing-date").type("2027-01-01")

    submitAndConfirmExceptions()

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(1)").find(".checkmark-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(1) td:nth-child(1) .checkmark-icon").should("have.length", 1)

    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(2)").find(".checkmark-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(1) td:nth-child(1) .checkmark-icon").should("have.length", 1)

    cy.get("#offences tbody tr:nth-child(3)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(3)").find(".checkmark-icon").should("not.exist")
  })

  it("Should display only one warning icon per offence", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateAndLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateAndLocationExceptions.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")

    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .warning-icon").should("have.length", 1)
  })

  it("Should display warning icon when only one of the exceptions is resolved for that particular offence", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateAndLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateAndLocationExceptions.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")

    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .warning-icon").should("have.length", 1)

    cy.get(".govuk-link")
      .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
      .click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF01")
    cy.get("#next-hearing-date").type("2027-01-01")

    submitAndConfirmExceptions()

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .checkmark-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .checkmark-icon").should("have.length", 1)
  })

  it("Should not display exceptions warning icons when exeptionsEnabled is false for a user", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("NoExceptionsFeatureFlag", "/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")
  })
})
