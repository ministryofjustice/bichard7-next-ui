import { subHours } from "date-fns"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { TestTrigger } from "../../test/utils/manageTriggers"
import hashedPassword from "../fixtures/hashedPassword"
import a11yConfig from "../support/a11yConfig"
import {
  confirmFiltersAppliedContains,
  confirmMultipleFieldsDisplayed,
  confirmMultipleFieldsNotDisplayed
} from "../support/helpers"
import logAccessibilityViolations from "../support/logAccessibilityViolations"

const loginAndGoToUrl = (emailAddress = "bichard01@example.com", url = "/bichard") => {
  cy.login(emailAddress, "password")
  cy.visit(url)
}

const unlockCase = (caseToUnlockNumber: string, caseToUnlockText: string) => {
  cy.get(`tbody tr:nth-child(${caseToUnlockNumber}) .locked-by-tag`).get("button").contains(caseToUnlockText).click()
  cy.get("button").contains("Unlock").click()
}

describe("Case list", () => {
  const defaultUsers: Partial<User>[] = Array.from(Array(5)).map((_value, idx) => {
    return {
      username: `Bichard0${idx}`,
      visibleForces: [`0${idx}`],
      forenames: "Bichard Test User",
      surname: `0${idx}`,
      email: `bichard0${idx}@example.com`,
      password: hashedPassword
    }
  })
  defaultUsers.push({
    username: `Bichard011111`,
    visibleForces: [`011111`],
    forenames: "Bichard Test User",
    surname: `011111`,
    email: `bichard011111@example.com`,
    password: hashedPassword
  })
  defaultUsers.push({
    username: `Supervisor`,
    visibleForces: [`011111`],
    forenames: "Sup",
    surname: "User",
    email: "supervisor@example.com",
    password: hashedPassword
  })

  before(() => {
    cy.task("clearUsers")
    cy.task("insertUsers", { users: defaultUsers, userGroups: ["B7NewUI_grp"] })
    cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7GeneralHandler_grp" })
    cy.task("insertIntoUserGroup", { emailAddress: "supervisor@example.com", groupName: "B7Supervisor_grp" })
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  context("when there are 0 cases", () => {
    it("should display 0 cases and the user's username when no cases are added", () => {
      loginAndGoToUrl()

      cy.findByText("There are no court cases to show").should("exist")
    })

    it("should not show pagination buttons when there are 0 cases", () => {
      loginAndGoToUrl()

      cy.findByText("Previous page").should("not.exist")
      cy.findByText("Next page").should("not.exist")
      cy.get("#bottom-pagination-bar").should("not.be.visible")
    })

    it("should display 0 cases when there are no cases 'locked to me' and hide the bottom pagination bar ", () => {
      const lockUsernames = ["Bichard02", "Bichard03", null, "A really really really long name"]
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
      cy.get("#bottom-pagination-bar").should("not.be.visible")
    })

    it("should be accessible", () => {
      loginAndGoToUrl()
      cy.injectAxe()

      // Wait for the page to fully load
      cy.get("h1")

      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })
  })

  context("when there are multiple cases", () => {
    it("should be accessible", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 50, force: "01" })
      loginAndGoToUrl()
      cy.injectAxe()

      // Wait for the page to fully load
      cy.get("h1")

      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })

    it("should display all the headings with sorting or not", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
      loginAndGoToUrl()
      cy.get("#defendant-name-sort").contains("Defendant Name").should("have.attr", "href")
      cy.get("#court-date-sort").contains("Court Date").should("have.attr", "href")
      cy.get("#court-name-sort").contains("Court Name").should("have.attr", "href")
      cy.get("#ptiurn-sort").contains("PTIURN").should("have.attr", "href")
      cy.get("#is-urgent-sort").contains("Urgent").should("have.attr", "href")
      cy.contains("Notes").should("not.have.attr", "href")
      cy.contains("Reason").should("not.have.attr", "href")
      cy.get("#locked-by-sort").contains("Locked By").should("have.attr", "href")
    })

    it("should display multiple cases", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 50, force: "01" })
      loginAndGoToUrl()

      cy.findByText(`Case00000`).should("exist")
      cy.findByText(`Case00001`).should("exist")
      cy.findByText(`Case00002`).should("exist")
      cy.findByText(`Case00003`).should("exist")
      cy.findByText(`Case00004`).should("exist")

      it("should not show pagination buttons when there are 0 cases", () => {
        loginAndGoToUrl()

        cy.get(".moj-pagination__item").should("not.exist")
      })

      it("should display appropriate pagination results when there are 0 cases", () => {
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("p.moj-pagination__results").should("contain.text", "Showing 0 cases")
      })

      it("should be accessible", () => {
        loginAndGoToUrl()
        cy.injectAxe()

        // Wait for the page to fully load
        cy.get("h1")

        cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
      })
    })

    it("should display a case for the user's org", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
      loginAndGoToUrl()

      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00000`)
    })

    it("should only display cases visible to users forces", () => {
      cy.task("insertCourtCasesWithFields", [
        { orgForPoliceFilter: "01" },
        { orgForPoliceFilter: "02" },
        { orgForPoliceFilter: "03" },
        { orgForPoliceFilter: "04" }
      ])

      loginAndGoToUrl("bichard02@example.com")

      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00001`)
    })

    it("should display cases for sub-forces", () => {
      cy.task("insertCourtCasesWithFields", [
        { orgForPoliceFilter: "01" },
        { orgForPoliceFilter: "011" },
        { orgForPoliceFilter: "012A" },
        { orgForPoliceFilter: "013A1" }
      ])

      loginAndGoToUrl()

      cy.get("tr")
        .not(":first")
        .each((row, index) => {
          cy.wrap(row).get("td:nth-child(5)").contains(`Case0000${index}`)
        })
    })

    it("should display cases for parent forces up to the second-level force", () => {
      cy.task("insertCourtCasesWithFields", [
        { orgForPoliceFilter: "01" },
        { orgForPoliceFilter: "011" },
        { orgForPoliceFilter: "0111" },
        { orgForPoliceFilter: "01111" },
        { orgForPoliceFilter: "011111" }
      ])

      loginAndGoToUrl("bichard011111@example.com")

      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00000").should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00001").should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00002")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00003")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00004")
    })

    it("can display cases ordered by court name", () => {
      cy.task("insertCourtCasesWithFields", [
        { courtName: "BBBB", orgForPoliceFilter: "011111" },
        { courtName: "AAAA", orgForPoliceFilter: "011111" },
        { courtName: "DDDD", orgForPoliceFilter: "011111" },
        { courtName: "CCCC", orgForPoliceFilter: "011111" }
      ])

      loginAndGoToUrl()

      cy.findByText("Court Name").parent().siblings().get('*[class^="icon"]').get(".unorderedArrow").should("exist")
      cy.findByText("Court Name").click()
      cy.findByText("Court Name").parent().siblings().get('*[class^="icon"]').should("exist")
      cy.findByText("Court Name").parent().siblings().get('*[class^="icon"]').get(".upArrow").should("exist")

      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).get("td:nth-child(4)").first().contains("AAAA")
          cy.wrap(row).get("td:nth-child(4)").last().contains("DDDD")
        })

      cy.findByText("Court Name").click()
      cy.findByText("Court Name").parent().siblings().get('*[class^="icon"]').get(".downArrow").should("exist")

      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).get("td:nth-child(4)").first().contains("DDDD")
          cy.wrap(row).get("td:nth-child(4)").last().contains("AAAA")
        })
    })

    it("Should display the resolved badge on cases marked as resolved", () => {
      cy.task("insertCourtCasesWithFields", [
        { resolutionTimestamp: new Date(), orgForPoliceFilter: "01" },
        { resolutionTimestamp: null, orgForPoliceFilter: "01" },
        { resolutionTimestamp: new Date(), orgForPoliceFilter: "01" }
      ])

      loginAndGoToUrl()

      cy.get("#filter-button").contains("Show filter").click()
      cy.get("#unresolved-and-resolved").click()
      cy.get("#search").contains("Apply filters").click()

      cy.get("tr").not(":first").eq(0).get("td:nth-child(5)").contains(`Case00000`)
      cy.get("tr").not(":first").eq(0).contains(`Resolved`).should("exist")
      cy.get("tr").not(":first").eq(1).contains(`Resolved`).should("not.exist")
      cy.get("tr").not(":first").eq(2).contains(`Resolved`).should("exist")
    })

    it("Should display the correct number of user-created notes on cases", () => {
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
    })

    it("should be able to navigate to the case details page and back", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 3, force: "01" })

      loginAndGoToUrl()

      cy.findByText("Defendant Name 0").click()

      cy.url().should("match", /\/court-cases\//)
      cy.findByText("Case Details").should("exist")

      cy.findByText("Cases").click()

      cy.url().should("match", /\/bichard/)
      cy.get("h1").contains("Case list").should("exist")
    })

    it("Should display the urgent badge on cases marked as urgent", () => {
      cy.task("insertCourtCasesWithFields", [
        { isUrgent: true, orgForPoliceFilter: "01" },
        { isUrgent: false, orgForPoliceFilter: "01" },
        { isUrgent: true, orgForPoliceFilter: "01" }
      ])

      loginAndGoToUrl()

      cy.get("tr").not(":first").eq(0).get("td:nth-child(5)").contains(`Case00000`)
      cy.get("tr").not(":first").eq(0).contains(`Urgent`).should("exist")
      cy.get("tr").not(":first").eq(1).contains(`Urgent`).should("not.exist")
      cy.get("tr").not(":first").eq(2).contains(`Urgent`).should("exist")
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

    it("can display cases ordered by urgency", () => {
      const force = "011111"
      cy.task(
        "insertCourtCasesWithFields",
        [
          false,
          false,
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
          true,
          false,
          false,
          false,
          false,
          true,
          true,
          false,
          true,
          true
        ].map((urgency) => ({
          isUrgent: urgency,
          orgForPoliceFilter: force
        }))
      )

      loginAndGoToUrl()

      cy.get(".cases-per-page").first().select("10")
      cy.location("search").should("include", "maxPageItems=10")
      cy.get("#is-urgent-sort").click()

      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).contains(`Urgent`).should("not.exist")
        })

      cy.get(".cases-per-page").first().select("10")
      cy.location("search").should("include", "maxPageItems=10")
      cy.get("#is-urgent-sort").click()

      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).contains(`Urgent`).should("exist")
        })
    })

    it("shows who has locked a case in the 'locked by' column", () => {
      const lockUsernames = ["Bichard01", "Bichard02", null, "A really really really long name"]
      cy.task(
        "insertCourtCasesWithFields",
        lockUsernames.map((username) => ({
          errorLockedByUsername: username,
          triggerLockedByUsername: username,
          orgForPoliceFilter: "011111"
        }))
      )
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })
      cy.task("insertTriggers", { caseId: 1, triggers })
      cy.task("insertTriggers", { caseId: 2, triggers })
      cy.task("insertTriggers", { caseId: 3, triggers })

      loginAndGoToUrl()

      //Error locks
      cy.get(`tbody tr:nth-child(1) .locked-by-tag`).should("have.text", "Bichard01")
      cy.get(`tbody tr:nth-child(1) img[alt="Lock icon"]`).should("exist")
      cy.get(`tbody tr:nth-child(3) .locked-by-tag`).should("have.text", "Bichard02")
      cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("exist")
      cy.get(`tbody tr:nth-child(5) .locked-by-tag`).should("not.exist")
      cy.get(`tbody tr:nth-child(5) img[alt="Lock icon"]`).should("not.exist")
      cy.get(`tbody tr:nth-child(7) .locked-by-tag`).should("have.text", "A really really really long name")
      cy.get(`tbody tr:nth-child(7) img[alt="Lock icon"]`).should("exist")

      //Trigger locks
      cy.get(`tbody tr:nth-child(2) .locked-by-tag`).should("have.text", "Bichard01")
      cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("exist")
      cy.get(`tbody tr:nth-child(4) .locked-by-tag`).should("have.text", "Bichard02")
      cy.get(`tbody tr:nth-child(4) img[alt="Lock icon"]`).should("exist")
      cy.get(`tbody tr:nth-child(6) .locked-by-tag`).should("not.exist")
      cy.get(`tbody tr:nth-child(6) img[alt="Lock icon"]`).should("not.exist")
      cy.get(`tbody tr:nth-child(8) .locked-by-tag`).should("have.text", "A really really really long name")
      cy.get(`tbody tr:nth-child(8) img[alt="Lock icon"]`).should("exist")
    })

    it("can sort cases by who has locked it", () => {
      const lockUsernames = ["Bichard01", "Bichard02", null, "A really really really long name"]
      cy.task(
        "insertCourtCasesWithFields",
        lockUsernames.map((username) => ({
          errorLockedByUsername: username,
          triggerLockedByUsername: username,
          orgForPoliceFilter: "011111"
        }))
      )

      loginAndGoToUrl()

      // Default: sorted by case ID
      const caseIdOrder = [0, 1, 2, 3]
      cy.get("tbody td:nth-child(5)").each((element, index) => {
        cy.wrap(element).should("have.text", `Case0000${caseIdOrder[index]}`)
      })

      // Sort ascending
      cy.get("#locked-by-sort").click()
      const ascendingOrder = [3, 0, 1, 2]
      cy.get("tbody td:nth-child(5)").each((element, index) => {
        cy.wrap(element).should("have.text", `Case0000${ascendingOrder[index]}`)
      })

      // Sort descending
      cy.get("#locked-by-sort").click()
      const descendingOrder = [2, 1, 0, 3]
      cy.get("tbody td:nth-child(5)").each((element, index) => {
        cy.wrap(element).should("have.text", `Case0000${descendingOrder[index]}`)
      })
    })

    it("should apply secondary sort of court date", () => {
      const courtDates = [new Date("09/12/2021"), new Date("04/01/2022"), new Date("01/07/2020")]
      cy.task("insertCourtCasesWithFields", [
        ...courtDates.map((courtDate) => ({
          courtDate: courtDate,
          defendantName: "WAYNE Bruce",
          orgForPoliceFilter: "011111"
        })),
        ...courtDates.map((courtDate) => ({
          courtDate: courtDate,
          defendantName: "PENNYWORTH Alfred",
          orgForPoliceFilter: "011111"
        }))
      ])

      loginAndGoToUrl()

      // Default: sorted by court date
      const caseIdOrder = [2, 5, 0, 3, 1, 4]
      cy.get("tbody td:nth-child(5)").each((element, index) => {
        cy.wrap(element).should("have.text", `Case0000${caseIdOrder[index]}`)
      })

      // Sort ascending by defendant name
      cy.get("#defendant-name-sort").click()
      const ascendingOrder = [5, 3, 4, 2, 0, 1]
      cy.get("tbody td:nth-child(5)").each((element, index) => {
        cy.wrap(element).should("have.text", `Case0000${ascendingOrder[index]}`)
      })
    })

    it("should unlock a case that is locked to the user", () => {
      const lockUsernames = ["Bichard01", "Bichard02"]
      cy.task(
        "insertCourtCasesWithFields",
        lockUsernames.map((username) => ({
          errorLockedByUsername: username,
          triggerLockedByUsername: username,
          orgForPoliceFilter: "011111",
          errorCount: 1,
          triggerCount: 1
        }))
      )
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })

      loginAndGoToUrl()

      // Exception lock
      cy.get(`tbody tr:nth-child(1) .locked-by-tag`).get("button").contains("Bichard01").should("exist")
      cy.get(`tbody tr:nth-child(1) img[alt="Lock icon"]`).should("exist")
      // Trigger lock
      cy.get(`tbody tr:nth-child(2) .locked-by-tag`).get("button").contains("Bichard01").should("exist")
      cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("exist")
      // User should not see unlock button when a case assigned to another user
      cy.get(`tbody tr:nth-child(3) .locked-by-tag`).get("button").contains("Bichard02").should("not.exist")
      cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("exist")

      // Unlock the exception assigned to the user
      unlockCase("1", "Bichard01")
      cy.get(`tbody tr:nth-child(1) .locked-by-tag`).should("not.exist")
      cy.get(`tbody tr:nth-child(1) img[alt="Lock icon"]`).should("not.exist")
      cy.get(`tbody tr:nth-child(2) .locked-by-tag`).get("button").contains("Bichard01").should("exist")
      cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("exist")
      cy.get(`tbody tr:nth-child(3) .locked-by-tag`).should("have.text", "Bichard02")
      cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("exist")

      // Unlock the trigger assigned to the user
      unlockCase("2", "Bichard01")
      cy.get(`tbody tr:nth-child(2) .locked-by-tag`).should("not.exist")
      cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("not.exist")
      cy.get(`tbody tr:nth-child(3) .locked-by-tag`).should("have.text", "Bichard02")
      cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("exist")
    })

    it("should unlock any case as a supervisor user", () => {
      const lockUsernames = ["Bichard01", "Bichard02"]
      cy.task(
        "insertCourtCasesWithFields",
        lockUsernames.map((username) => ({
          errorLockedByUsername: username,
          triggerLockedByUsername: username,
          orgForPoliceFilter: "011111",
          errorCount: 1,
          triggerCount: 1
        }))
      )
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })

      loginAndGoToUrl("supervisor@example.com")

      cy.get(`tbody tr:nth-child(1) .locked-by-tag`).get("button").contains("Bichard01").should("exist")
      cy.get(`tbody tr:nth-child(1) img[alt="Lock icon"]`).should("exist")
      cy.get(`tbody tr:nth-child(2) .locked-by-tag`).get("button").contains("Bichard01").should("exist")
      cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("exist")
      cy.get(`tbody tr:nth-child(3) .locked-by-tag`).get("button").contains("Bichard02").should("exist")
      cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("exist")

      // Unlock both cases
      unlockCase("1", "Bichard01")
      unlockCase("2", "Bichard01")
      unlockCase("3", "Bichard02")

      cy.get(`tbody tr:nth-child(1) .locked-by-tag`).should("not.exist")
      cy.get(`tbody tr:nth-child(1) img[alt="Lock icon"]`).should("not.exist")
      cy.get(`tbody tr:nth-child(2) .locked-by-tag`).should("not.exist")
      cy.get(`tbody tr:nth-child(2) img[alt="Lock icon"]`).should("not.exist")
      cy.get(`tbody tr:nth-child(3) .locked-by-tag`).should("not.exist")
      cy.get(`tbody tr:nth-child(3) img[alt="Lock icon"]`).should("not.exist")
    })
  })

  describe("Pagination", () => {
    it("should be accessible", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 100, force: "01" })

      loginAndGoToUrl()

      cy.injectAxe()

      // Wait for the page to fully load
      cy.get("h1")

      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })

    it("lets users select how many cases to show per page", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 100, force: "01" })

      loginAndGoToUrl()

      cy.get("tbody tr").should("have.length", 25)
      cy.get("tr").contains("Case00000").should("exist")
      cy.get("tr").contains("Case00024").should("exist")

      cy.get(".cases-per-page").first().select("10")
      cy.get("tbody tr").should("have.length", 10)

      cy.get(".cases-per-page").first().select("50")
      cy.get("tbody tr").should("have.length", 50)

      cy.get(".cases-per-page").first().select("100")
      cy.get("tbody tr").should("have.length", 100)

      cy.get(".cases-per-page").first().select("25")
      // Navigating to a different page should keep the same page size
      cy.get(".moj-pagination__item").contains("Next").first().click()
      cy.get("tbody tr").should("have.length", 25)
      cy.get("tr").contains("Case00025").should("exist")
      cy.get("tr").contains("Case00049").should("exist")

      cy.get(".cases-per-page").first().select("10")
      cy.get("tbody tr").should("have.length", 10)
    })

    it("keeps roughly the same position in the case list when changing page size", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 100, force: "01" })

      loginAndGoToUrl()

      cy.get(".cases-per-page").first().select("25")
      cy.get("tbody tr").should("have.length", 25)

      cy.get(".moj-pagination__item").contains("Next").first().click()
      cy.get("tbody tr").should("have.length", 25)
      cy.get("tr").contains("Case00025").should("exist")

      cy.get(".cases-per-page").first().select("10")
      cy.get("tbody tr").should("have.length", 10)
      cy.get("tr").contains("Case00025").should("exist")
    })

    it("doesn't show navigation options when there is only one page", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 3, force: "01" })

      loginAndGoToUrl()

      cy.get(".moj-pagination__list li").should("not.exist")
    })

    it("has correct pagination information when there is only one page", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 3, force: "01" })

      loginAndGoToUrl()

      cy.get("p.moj-pagination__results").should("contain.text", "Showing 1 to 3 of 3 cases")
    })

    it("lets users navigate back and forth between pages using the page numbers", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 250, force: "01" })

      loginAndGoToUrl()

      cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 1 to 25 of 250 cases")
      cy.get("tr").contains("Case00000").should("exist")
      cy.get("tr").contains("Case00024").should("exist")

      cy.get("li.moj-pagination__item").contains("2").click()
      cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 26 to 50 of 250 cases")
      cy.get("tr").contains("Case00025").should("exist")
      cy.get("tr").contains("Case00049").should("exist")

      cy.get("li.moj-pagination__item").contains("10").click()
      cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 226 to 250 of 250 cases")
      cy.get("tr").contains("Case00225").should("exist")
      cy.get("tr").contains("Case00249").should("exist")

      cy.get("li.moj-pagination__item").contains("9").click()
      cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 201 to 225 of 250 cases")
      cy.get("tr").contains("Case00200").should("exist")
      cy.get("tr").contains("Case00224").should("exist")
    })

    it("lets users navigate back and forth between pages using the next and previous arrows", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 250, force: "01" })

      loginAndGoToUrl()

      cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 1 to 25 of 250 cases")
      cy.get("tr").contains("Case00000").should("exist")
      cy.get("tr").contains("Case00024").should("exist")

      cy.get("li.moj-pagination__item").contains("Next").click()
      cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 26 to 50 of 250 cases")
      cy.get("tr").contains("Case00025").should("exist")
      cy.get("tr").contains("Case00049").should("exist")

      cy.get("li.moj-pagination__item").contains("Next").click()
      cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 51 to 75 of 250 cases")
      cy.get("tr").contains("Case00050").should("exist")
      cy.get("tr").contains("Case00074").should("exist")

      cy.get("li.moj-pagination__item").contains("Previous").click()
      cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 26 to 50 of 250 cases")
      cy.get("tr").contains("Case00025").should("exist")
      cy.get("tr").contains("Case00049").should("exist")
    })

    it("has correct pagination information on page 5 out of 10", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 250, force: "01" })

      loginAndGoToUrl(undefined, "/bichard?page=5")

      cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 101 to 125 of 250 cases")
      cy.get("tr").contains("Case00100").should("exist")
      cy.get("tr").contains("Case00124").should("exist")
    })

    it("keeps other filters applied when changing pages", () => {
      cy.task("insertMultipleDummyCourtCases", { numToInsert: 50, force: "01" })

      loginAndGoToUrl()

      cy.get("#filter-button").click()
      cy.get("#urgent").click()
      cy.get("#search").click()

      confirmFiltersAppliedContains("Urgent")

      cy.get("li.moj-pagination__item").contains("Next").click()
      confirmFiltersAppliedContains("Urgent")
    })
  })

  describe("Only shows relevant resolved cases to the user", () => {
    it("shows supervisors all resolved cases from their force", () => {
      const casesConfig = [
        {
          force: "011111",
          resolved: true,
          id: 0
        },
        {
          force: "011111",
          resolved: true,
          id: 1
        },
        {
          force: "011111",
          resolved: false,
          id: 2
        },
        {
          force: "02",
          resolved: true,
          id: 3
        },
        {
          force: "03",
          resolved: false,
          id: 4
        },
        {
          force: "011111",
          resolved: false,
          id: 5
        }
      ]
      const cases: Partial<CourtCase>[] = casesConfig.map((caseConfig) => {
        const resolutionDate = subHours(new Date(), Math.random() * 100)
        return {
          errorId: caseConfig.id,
          orgForPoliceFilter: caseConfig.force,
          resolutionTimestamp: caseConfig.resolved ? resolutionDate : null
        }
      })
      cy.task("insertCourtCasesWithFields", cases)

      loginAndGoToUrl("supervisor@example.com")

      cy.get("#filter-button").click()
      cy.get("#resolved").click()
      cy.get("#search").click()

      confirmMultipleFieldsDisplayed(["Case00000", "Case00001"])
      confirmMultipleFieldsNotDisplayed(["Case00002", "Case00003", "Case00004", "Case00005"])
    })

    it("shows handlers resolved cases that only they resolved exceptions for", () => {
      const casesConfig = [
        {
          force: "011111",
          resolved: true,
          resolvedBy: "Supervisor",
          id: 0
        },
        {
          force: "011111",
          resolved: true,
          resolvedBy: "Bichard01",
          id: 1
        },
        {
          force: "011111",
          resolved: false,
          id: 2
        },
        {
          force: "02",
          resolved: true,
          resolvedBy: "Bichard02",
          id: 3
        },
        {
          force: "03",
          resolved: false,
          id: 4
        },
        {
          force: "011111",
          resolved: false,
          id: 5
        },
        {
          force: "011111",
          resolved: true,
          resolvedBy: "Bichard01",
          id: 6
        }
      ]
      const cases: Partial<CourtCase>[] = casesConfig.map((caseConfig) => {
        const resolutionDate = subHours(new Date(), Math.random() * 100)
        return {
          errorId: caseConfig.id,
          orgForPoliceFilter: caseConfig.force,
          resolutionTimestamp: caseConfig.resolved ? resolutionDate : null,
          errorResolvedBy: caseConfig.resolvedBy ?? null
        }
      })
      cy.task("insertCourtCasesWithFields", cases)

      loginAndGoToUrl()

      cy.get("#filter-button").click()
      cy.get("#resolved").click()
      cy.get("#search").click()

      confirmMultipleFieldsDisplayed(["Case00001", "Case00006"])
      confirmMultipleFieldsNotDisplayed(["Case00000", "Case00002", "Case00003", "Case00004", "Case00005"])
    })

    it("shows handlers resolved cases that only they resolved triggers for", () => {
      const casesConfig = [
        {
          force: "011111",
          resolved: true,
          resolvedBy: "Supervisor",
          id: 0
        },
        {
          force: "011111",
          resolved: true,
          resolvedBy: "Bichard01",
          id: 1
        },
        {
          force: "011111",
          resolved: false,
          id: 2
        },
        {
          force: "02",
          resolved: true,
          resolvedBy: "Bichard02",
          id: 3
        },
        {
          force: "03",
          resolved: false,
          id: 4
        },
        {
          force: "011111",
          resolved: false,
          id: 5
        },
        {
          force: "011111",
          resolved: true,
          resolvedBy: "Bichard01",
          id: 6
        }
      ]
      const cases: Partial<CourtCase>[] = casesConfig.map((caseConfig) => {
        const resolutionDate = subHours(new Date(), Math.random() * 100)
        return {
          errorId: caseConfig.id,
          orgForPoliceFilter: caseConfig.force,
          resolutionTimestamp: caseConfig.resolved ? resolutionDate : null
        }
      })
      cy.task("insertCourtCasesWithFields", cases)

      casesConfig
        .filter((c) => !!c.resolvedBy)
        .forEach((caseConfig) => {
          cy.task("insertTriggers", {
            caseId: caseConfig.id,
            triggers: [
              {
                triggerId: caseConfig.id,
                triggerCode: "TRPR0010",
                status: "Resolved",
                createdAt: new Date("2023-03-07T10:22:34.000Z"),
                resolvedBy: caseConfig.resolvedBy,
                resolvedAt: new Date("2023-03-07T12:22:34.000Z")
              }
            ]
          })
        })

      loginAndGoToUrl()

      cy.get("#filter-button").click()
      cy.get("#resolved").click()
      cy.get("#search").click()

      confirmMultipleFieldsDisplayed(["Case00001", "Case00006"])
      confirmMultipleFieldsNotDisplayed(["Case00000", "Case00002", "Case00003", "Case00004", "Case00005"])
    })
  })
})

export {}
