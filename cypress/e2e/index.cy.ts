import { TestTrigger } from "../../test/utils/manageTriggers"
import a11yConfig from "../support/a11yConfig"
import { defaultSetup, loginAndGoToUrl } from "../support/helpers"
import logAccessibilityViolations from "../support/logAccessibilityViolations"

describe("Case list", () => {
  before(() => {
    defaultSetup()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("will not find a password in the NEXT_DATA", () => {
    loginAndGoToUrl()

    cy.window().its("__NEXT_DATA__.props.pageProps.user.password").should("not.exist")
  })

  context("when there are 0 cases", () => {
    it("Should display 0 cases and the user's username when no cases are added", () => {
      loginAndGoToUrl()

      cy.findByText("There are no court cases to show").should("exist")
    })

    it("Should not show pagination buttons when there are 0 cases", () => {
      loginAndGoToUrl()

      cy.findByText("Previous page").should("not.exist")
      cy.findByText("Next page").should("not.exist")
      cy.get("#top-pagination-bar").should("not.exist")
      cy.get("#bottom-pagination-bar").should("not.exist")
    })

    it("Should display 0 cases when there are no cases 'locked to me' and hide the bottom pagination bar ", () => {
      const lockUsernames = ["Bichard02", "Bichard03", null, "A really really really long.name"]
      cy.task(
        "insertCourtCasesWithFields",
        lockUsernames.map((username) => ({
          errorLockedByUsername: username,
          triggerLockedByUsername: username,
          orgForPoliceFilter: "011111"
        }))
      )

      loginAndGoToUrl()

      cy.get("#filter-button").click()
      cy.get(".govuk-checkboxes__item").contains("View cases locked to me").click()
      cy.contains("Apply filters").click()

      cy.findByText("Previous page").should("not.exist")
      cy.findByText("Next page").should("not.exist")
      cy.get("#top-pagination-bar").should("not.exist")
      cy.get("#bottom-pagination-bar").should("not.exist")
    })

    it("Should be accessible", () => {
      loginAndGoToUrl()
      cy.injectAxe()

      // Wait for the page to fully load
      cy.get("h1")

      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })
  })

  context("when there are multiple cases", () => {
    it("Should be accessible", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 50, force: "01" })
      loginAndGoToUrl()
      cy.injectAxe()

      // Wait for the page to fully load
      cy.get("h1")

      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })

    it("Should display all the headings with sorting or not", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
      loginAndGoToUrl()
      cy.get("#defendant-name-sort").contains("Defendant name").should("have.attr", "href")
      cy.get("#court-date-sort").contains("Court date").should("have.attr", "href")
      cy.get("#court-name-sort").contains("Court name").should("have.attr", "href")
      cy.get("#ptiurn-sort").contains("PTIURN").should("have.attr", "href")
      cy.contains("Notes").should("have.attr", "href")
      cy.contains("Reason").should("not.have.attr", "href")
      cy.get("#locked-by-sort").contains("Locked by").should("have.attr", "href")
    })

    it("Should display multiple cases", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 50, force: "01" })
      loginAndGoToUrl()

      cy.findByText(`Case00000`).should("exist")
      cy.findByText(`Case00001`).should("exist")
      cy.findByText(`Case00002`).should("exist")
      cy.findByText(`Case00003`).should("exist")
      cy.findByText(`Case00004`).should("exist")

      it("Should not show pagination buttons when there are 0 cases", () => {
        loginAndGoToUrl()

        cy.get(".moj-pagination__item").should("not.exist")
      })

      it("Should display appropriate pagination results when there are 0 cases", () => {
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("p.moj-pagination__results").should("contain.text", "Showing 0 cases")
      })

      it("Should be accessible", () => {
        loginAndGoToUrl()
        cy.injectAxe()

        // Wait for the page to fully load
        cy.get("h1")

        cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
      })
    })

    it("Should display the resolved badge on cases marked as resolved", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorStatus: "Resolved",
          resolutionTimestamp: new Date(),
          errorResolvedBy: "Bichard01",
          errorResolvedTimestamp: new Date(),
          orgForPoliceFilter: "01"
        },
        { resolutionTimestamp: null, orgForPoliceFilter: "01" },
        { resolutionTimestamp: null, orgForPoliceFilter: "01" }
      ])

      loginAndGoToUrl()

      cy.get("#filter-button").contains("Show search panel").click()
      cy.get("#resolved").click()
      cy.get("#search").contains("Apply filters").click()

      cy.get("tr").not(":first").eq(0).get("td:nth-child(5)").contains(`Case00000`)
      cy.get("tr").not(":first").eq(0).contains(`Resolved`).should("exist")
      cy.get("tr").not(":first").eq(1).should("not.exist")
      cy.get("tr").not(":first").eq(2).should("not.exist")
    })

    it("Should display the submitted badge on cases marked as submitted", () => {
      cy.task("insertCourtCasesWithFields", [
        { errorStatus: "Submitted", orgForPoliceFilter: "01" },
        { errorStatus: "Unresolved", orgForPoliceFilter: "01" },
        { errorStatus: "Submitted", orgForPoliceFilter: "01" }
      ])

      loginAndGoToUrl()

      cy.get("#filter-button").contains("Show search panel").click()
      cy.get("#search").contains("Apply filters").click()

      cy.get("tr").not(":first").eq(0).get("td:nth-child(5)").contains(`Case00000`)
      cy.get("tr").not(":first").eq(0).contains(`Submitted`).should("exist")
      cy.get("tr").not(":first").eq(1).get("td:nth-child(5)").contains(`Case00001`)
      cy.get("tr").not(":first").eq(1).contains(`Submitted`).should("not.exist")
      cy.get("tr").not(":first").eq(2).get("td:nth-child(5)").contains(`Case00002`)
      cy.get("tr").not(":first").eq(2).contains(`Submitted`).should("exist")
    })

    it("Should display the correct number of user-created notes on cases & allow the sort by the number of notes", () => {
      const caseNotes: { user: string; text: string }[][] = [
        [
          {
            user: "System",
            text: "System note 1"
          }
        ],
        [
          {
            user: "System",
            text: "System note 2"
          },
          {
            user: "bichard01",
            text: "Test note 1"
          },
          {
            user: "System",
            text: "System note 3"
          }
        ],
        [
          {
            user: "bichard01",
            text: "Test note 2"
          },
          {
            user: "bichard02",
            text: "Test note 3"
          },
          {
            user: "bichard01",
            text: "Test note 4"
          }
        ]
      ]
      cy.task("insertCourtCasesWithNotes", { caseNotes: caseNotes, force: "01" })

      loginAndGoToUrl()

      cy.get("tr").not(":first").eq(0).get("td:nth-child(5)").contains(`Case00000`)
      cy.get("tr").not(":first").eq(0).get("td:nth-child(7)").should("be.empty")
      cy.get("tr").not(":first").eq(1).get("td:nth-child(7)").contains(`1`).should("exist")
      cy.get("tr").not(":first").eq(2).get("td:nth-child(7)").contains(`3`).should("exist")

      cy.get("#notes-sort").click()
      cy.get("tr").not(":first").eq(2).get("td:nth-child(5)").contains(`Case00002`)
      cy.get("tr").not(":first").eq(1).get("td:nth-child(5)").contains(`Case00001`)
    })

    it("Should be able to navigate to the case details page and back", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 3, force: "01" })

      loginAndGoToUrl()

      cy.findByText("Defendant Name 0")
        .should("have.attr", "href")
        .and("match", /\/court-cases\/\d+/)

      cy.findByText("Defendant Name 0").click()

      cy.url().should("match", /\/court-cases\/\d+/)
      cy.findByText("Case details").should("exist")

      cy.get("#leave-and-lock, #return-to-case-list").click()

      cy.url().should("match", /\/bichard/)
      cy.get("h1").contains("Case list").should("exist")
    })

    it("Should display a preview of the notes", () => {
      const caseNotes: { user: string; text: string }[][] = [
        [
          {
            user: "System",
            text: "System note 1"
          }
        ],
        [
          {
            user: "System",
            text: "System note 2"
          },
          {
            user: "bichard01",
            text: "Test note 1"
          },
          {
            user: "System",
            text: "System note 3"
          }
        ],
        [
          {
            user: "bichard01",
            text: "Test note 2"
          },
          {
            user: "bichard02",
            text: "Test note 3"
          },
          {
            user: "bichard01",
            text: "Test note 4"
          }
        ]
      ]
      cy.task("insertCourtCasesWithNotes", { caseNotes: caseNotes, force: "01" })

      loginAndGoToUrl()

      cy.get("tr").not(":first").eq(1).get("td:nth-child(7)").contains(`Preview`).should("exist").trigger("click")
      cy.contains(`Test note 1`).should("exist")
    })

    it("Should display reason (errors and triggers) with correct formatting", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "011111" }, { orgForPoliceFilter: "011111" }])

      cy.task("insertException", {
        caseId: 0,
        exceptionCode: "HO100310",
        errorReport: "HO100310||ds:OffenceReasonSequence"
      })
      cy.task("insertException", {
        caseId: 0,
        exceptionCode: "HO100322",
        errorReport: "HO100322||ds:OrganisationUnitCode"
      })
      cy.task("insertException", {
        caseId: 0,
        exceptionCode: "HO100310",
        errorReport: "HO100310||ds:OffenceReasonSequence"
      })

      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0010",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        },
        {
          triggerId: 1,
          triggerCode: "TRPR0015",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })

      loginAndGoToUrl()

      cy.get("tr").not(":first").get("td:nth-child(8)").contains("HO100310 (2)")
      cy.get("tr").not(":first").get("td:nth-child(8)").contains("HO100322")
      cy.get("tr").not(":first").get("td:nth-child(8)").contains("TRPR0010 - Conditional bail")
      cy.get("tr").not(":first").get("td:nth-child(8)").contains("TRPR0015 - Personal details changed")
    })
  })
})
