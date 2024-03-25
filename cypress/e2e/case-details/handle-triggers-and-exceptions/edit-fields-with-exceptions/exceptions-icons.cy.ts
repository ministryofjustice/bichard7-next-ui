import hashedPassword from "../../../../fixtures/hashedPassword"
import AsnExceptionHO100206 from "../../../../../test/test-data/AsnExceptionHo100206.json"
import AsnExceptionHO100321 from "../../../../../test/test-data/AsnExceptionHo100321.json"
import nextHearingDateExceptions from "../../../../../test/test-data/NextHearingDateExceptions.json"
import nextHearingLocationExceptions from "../../../../../test/test-data/NextHearingLocationExceptions.json"
import { submitAndConfirmExceptions, loginAndGoToUrl } from "../../../../support/helpers"

describe("Tabs exceptions icons", () => {
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

  describe("ASN exception", () => {
    it("Should display 1 next to Defendant tab text when HO100206 is raised", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
          updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "Bichard01"
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1")
      cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("1").should("not.exist")
    })

    it("Should display 1 next to Defendant tab text when HO100321 is raised", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
          updatedHearingOutcome: AsnExceptionHO100321.hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: "Bichard01"
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1")
      cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("1").should("not.exist")
    })
  })

  describe("Next-hearing-date-exceptions", () => {
    describe("Exceptions icon", () => {
      ;[
        nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        nextHearingDateExceptions.hearingOutcomeXmlHO100323
      ].forEach((exception) => {
        it("Should display 1 next to the Offences tab text when either of the next-hearing-date exceptions is raised", () => {
          cy.task("clearCourtCases")
          cy.task("insertCourtCasesWithFields", [
            {
              orgForPoliceFilter: "01",
              hearingOutcome: exception,
              updatedHearingOutcome: exception,
              errorCount: 1
            }
          ])

          cy.login("bichard01@example.com", "password")
          cy.visit("/bichard/court-cases/0")

          cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1")
          cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("1").should("not.exist")
        })
      })
    })

    it("Should display 2 next to the Offences tab text when HO100102 and HO100323 are raised", () => {
      cy.task("clearCourtCases")
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102andHO100323,
          updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102andHO100323,
          errorCount: 1
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("2")
      cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("2").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("2").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("2").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("2").should("not.exist")
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
          cy.task("clearCourtCases")
          cy.task("insertCourtCasesWithFields", [
            {
              orgForPoliceFilter: "01",
              hearingOutcome: exception,
              updatedHearingOutcome: exception,
              errorCount: 1
            }
          ])

          cy.login("bichard01@example.com", "password")
          cy.visit("/bichard/court-cases/0")

          cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1")
          cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("1").should("not.exist")
        })
      })
    })

    it("Should display 3 next to the Offences tab text when HO100200, HO100300, or HO100322 are raised", () => {
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

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("3")
      cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("3").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("3").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("3").should("not.exist")
      cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("3").should("not.exist")
    })
  })
})

describe("Offences exceptions icons", () => {
  it("Should display a warning icon in front of the first offence when exception is raised and checkmark icon when exception is resolved", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        errorCount: 1,
        errorLockedByUsername: "Bichard01"
      }
    ])

    loginAndGoToUrl("bichard01@example.com", "/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get("tbody>tr:nth-child(1)").find(".warning-icon").should("exist")
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "false")
    cy.contains("td", "Next hearing date").siblings().get(".moj-badge").contains("Editable Field")
    cy.get("#next-hearing-date").type("2028-01-01")

    submitAndConfirmExceptions()

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get("tbody>tr:nth-child(1)").find(".warning-icon").should("not.exist")
    cy.get("tbody>tr:nth-child(1)").find(".checkmark-icon").should("exist")
  })

  it("Should display warning icons for the first and second offences when exceptions are raised. Once the exceptions for these offences are resolved, replace the warning icons with checkmark icons", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.updatedHearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndGoToUrl("bichard01@example.com", "/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get("tbody tr:nth-child(1)").find(".warning-icon").should("exist")
    cy.get("tbody tr:nth-child(2)").find(".warning-icon").should("exist")
    cy.get("tbody tr:nth-child(3)").find(".warning-icon").should("not.exist")

    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.contains("td", "Next hearing date").siblings().should("include.text", "false")
    cy.contains("td", "Next hearing date").siblings().get(".moj-badge").contains("Editable Field")
    cy.get("#next-hearing-date").type("2026-01-01")

    cy.get("button").contains("Next offence").click()

    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF01")
    cy.get("#next-hearing-date").type("2027-01-01")

    submitAndConfirmExceptions()

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get("tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")
    cy.get("tbody tr:nth-child(1)").find(".checkmark-icon").should("exist")

    cy.get("tbody tr:nth-child(2)").find(".warning-icon").should("not.exist")
    cy.get("tbody tr:nth-child(2)").find(".checkmark-icon").should("exist")

    cy.get("tbody tr:nth-child(3)").find(".warning-icon").should("not.exist")
    cy.get("tbody tr:nth-child(3)").find(".checkmark-icon").should("not.exist")
  })
})
