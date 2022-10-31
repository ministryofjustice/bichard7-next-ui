import User from "services/entities/User"
import { TestTrigger } from "../../test/utils/manageTriggers"
import a11yConfig from "../support/a11yConfig"
import logAccessibilityViolations from "../support/logAccessibilityViolations"

describe("Home", () => {
  const hashedPassword =
    "$argon2id$v=19$m=256,t=20,p=2$TTFCN3BRcldZVUtGejQ3WE45TGFqPT0$WOE+jDILDnVIAt1dytb+h65uegrMomp2xb0Q6TxbkLA"

  context("720p resolution", () => {
    const users: Partial<User>[] = Array.from(Array(5)).map((_value, idx) => {
      return {
        username: `Bichard0${idx}`,
        visibleForces: [`0${idx}`],
        forenames: "Bichard Test User",
        surname: `0${idx}`,
        email: `bichard0${idx}@example.com`,
        password: hashedPassword
      }
    })

    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.task("clearUsers")
      cy.viewport(1280, 720)
    })

    context("when there are 0 cases", () => {
      it("should display 0 cases and the user's username when no cases are added", () => {
        cy.task("insertUsers", users)
        const userEmail = "bichard01@example.com"
        cy.task("insertIntoUserGroup", { emailAddress: userEmail, groupName: "B7NewUI_grp" })
        cy.login(userEmail, "password")

        cy.visit("/bichard")

        cy.findByText("There are no court cases to show").should("exist")
      })

      it("should not show pagination buttons when there are 0 cases", () => {
        cy.task("insertUsers", users)
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.findByText("Previous page").should("not.exist")
        cy.findByText("Next page").should("not.exist")
      })

      it("should be accessible", () => {
        cy.task("insertUsers", users)
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.injectAxe()

        cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
      })
    })

    context("when there multiple cases", () => {
      it("should be accessible", () => {
        cy.task("insertUsers", users)
        cy.task("insertMultipleDummyCourtCases", { numToInsert: 50, force: "01" })
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.injectAxe()

        cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
      })

      it("should display multiple cases", () => {
        cy.task("insertUsers", users)
        cy.task("insertMultipleDummyCourtCases", { numToInsert: 50, force: "01" })
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.findByText(`Case00000`).should("exist")
        cy.findByText(`Case00001`).should("exist")
        cy.findByText(`Case00002`).should("exist")
        cy.findByText(`Case00003`).should("exist")
        cy.findByText(`Case00004`).should("exist")
      })

      it("should paginate buttons", () => {
        cy.task("insertUsers", users)
        cy.task("insertMultipleDummyCourtCases", { numToInsert: 50, force: "01" })
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.findByText("Previous page").should("not.exist")
        cy.findByText("Next page").should("exist")
        // paginate next page until the last page
        ;[...Array(8).keys()].forEach(() => {
          cy.findByText("Next page").click()
          cy.findByText("Previous page").should("exist")
          cy.findByText("Next page").should("exist")
        })
        cy.findByText("Next page").click()
        cy.findByText("Previous page").should("exist")
        cy.findByText("Next page").should("not.exist")
        // paginate previous page until the first page
        ;[...Array(8).keys()].forEach(() => {
          cy.findByText("Previous page").click()
          cy.findByText("Previous page").should("exist")
          cy.findByText("Next page").should("exist")
        })
        cy.findByText("Previous page").click()
        cy.findByText("Previous page").should("not.exist")
        cy.findByText("Next page").should("exist")
      })

      it("should display a case for the user's org", () => {
        cy.task("insertUsers", users)
        cy.task("insertCourtCasesWithOrgCodes", ["01"])
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
      })

      it("should only display cases visible to users forces", () => {
        cy.task("insertUsers", users)
        cy.task("insertCourtCasesWithOrgCodes", ["01", "02", "03", "04"])

        cy.login("bichard02@example.com", "password")
        cy.visit("/bichard")

        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)
      })

      it("should display cases for sub-forces", () => {
        cy.task("insertUsers", users)
        cy.task("insertCourtCasesWithOrgCodes", ["01", "011", "012A", "013A1"])

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("tr")
          .not(":first")
          .each((row, index) => {
            cy.wrap(row).get("td:nth-child(2)").contains(`Case0000${index}`)
          })
      })

      it("should display cases for parent forces up to the second-level force", () => {
        cy.task("insertUsers", [
          {
            username: "Bichard01",
            visibleForces: ["011111"],
            forenames: "Bichard Test User",
            surname: "01",
            email: "bichard01@example.com",
            password: hashedPassword
          }
        ])
        cy.task("insertCourtCasesWithOrgCodes", ["01", "011", "0111", "01111", "011111"])

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("tr")
          .not(":first")
          .each((row, index) => {
            cy.wrap(row)
              .get("td:nth-child(2)")
              .contains(`Case0000${index + 2}`)
          })
      })

      it("can display cases ordered by court name", () => {
        cy.task("insertUsers", [
          {
            username: "Bichard01",
            visibleForces: ["011111"],
            forenames: "Bichard Test User",
            surname: "01",
            email: "bichard01@example.com",
            password: hashedPassword
          }
        ])
        cy.task("insertCourtCasesWithCourtNames", { courtNames: ["BBBB", "AAAA", "DDDD", "CCCC"], force: "011111" })

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.findByText("Court Name").click()

        cy.get("tr")
          .not(":first")
          .each((row) => {
            cy.wrap(row).get("td:nth-child(4)").first().contains("AAAA")
            cy.wrap(row).get("td:nth-child(4)").last().contains("DDDD")
          })

        cy.findByText("Court Name").click()

        cy.get("tr")
          .not(":first")
          .each((row) => {
            cy.wrap(row).get("td:nth-child(4)").first().contains("DDDD")
            cy.wrap(row).get("td:nth-child(4)").last().contains("AAAA")
          })
      })

      it("can display cases filtered by defendant name", () => {
        cy.task("insertUsers", [
          {
            username: "Bichard01",
            visibleForces: ["011111"],
            forenames: "Bichard Test User",
            surname: "01",
            email: "bichard01@example.com",
            password: hashedPassword
          }
        ])
        cy.task("insertCourtCasesWithDefendantNames", {
          defendantNames: ["Bruce Wayne", "Barbara Gordon", "Alfred Pennyworth"],
          force: "011111"
        })

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("input[type=search]").type("Bruce Wayne")

        cy.get("button[title=Search]").click()
        cy.get("tr").eq(1).get("td:nth-child(3)").first().contains("Bruce Wayne")
        cy.get("tr").should("have.length", 2)
      })

      it("Should filter cases by whether they have triggers and exceptions", () => {
        cy.task("insertUsers", users)
        cy.task("insertCourtCasesWithOrgCodes", ["01", "01", "01", "01"])
        const triggers: TestTrigger[] = [
          {
            triggerId: 0,
            triggerCode: "TRPR0001",
            status: "Unresolved",
            createdAt: new Date("2022-07-09T10:22:34.000Z")
          }
        ]
        cy.task("insertTriggers", { caseId: 0, triggers })
        cy.task("insertException", { caseId: 0, exceptionCode: "HO100206" })

        cy.task("insertTriggers", { caseId: 1, triggers })

        cy.task("insertException", { caseId: 2, exceptionCode: "HO100207" })

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        // Default: no filter, all cases shown
        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)
        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00002`)
        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00003`)

        // Filtering by having triggers
        cy.get("#result-filter-select").select("triggers")
        cy.get("#result-filter-button").click()

        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)

        // Filtering by having exceptions
        cy.get("#result-filter-select").select("exceptions")
        cy.get("#result-filter-button").click()

        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00002`)

        // Clearing filters
        cy.get("#result-filter-select").select(0)
        cy.get("#result-filter-button").click()

        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)
        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00002`)
        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00003`)
      })

      it("should be able to navigate to the case details page and back", () => {
        cy.task("insertUsers", users)
        cy.task("insertMultipleDummyCourtCases", { numToInsert: 3, force: "01" })

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.findByText("Defendant Name 0").click()

        cy.url().should("match", /\/court-cases\//)
        cy.findByText("Case Details").should("exist")

        cy.findByText("Cases").click()

        cy.url().should("match", /\/bichard/)
        cy.findByText("Court cases").should("exist")
      })

      it("Should display the urgent badge on cases marked as urgent", () => {
        cy.task("insertUsers", users)
        cy.task("insertCourtCasesWithUrgencies", { urgencies: [true, false, true], force: "01" })

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("tr").not(":first").eq(0).get("td:nth-child(2)").contains(`Case00000`)
        cy.get("tr").not(":first").eq(0).contains(`Urgent`).should("exist")
        cy.get("tr").not(":first").eq(1).contains(`Urgent`).should("not.exist")
        cy.get("tr").not(":first").eq(2).contains(`Urgent`).should("exist")
      })

      it("Should display the correct number of user-created notes on cases", () => {
        cy.task("insertUsers", users)
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

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("tr").not(":first").eq(0).get("td:nth-child(2)").contains(`Case00000`)
        cy.get("tr").not(":first").eq(0).get("td:nth-child(6)").should("be.empty")
        cy.get("tr").not(":first").eq(1).get("td:nth-child(6)").contains(`1`).should("exist")
        cy.get("tr").not(":first").eq(2).get("td:nth-child(6)").contains(`3`).should("exist")
      })

      it("can display cases ordered by urgency", () => {
        cy.task("insertUsers", [
          {
            username: "Bichard01",
            visibleForces: ["011111"],
            forenames: "Bichard Test User",
            surname: "01",
            email: "bichard01@example.com",
            password: hashedPassword
          }
        ])
        cy.task("insertCourtCasesWithUrgencies", {
          urgencies: [false, false, true, false, true, true, false, false, true],
          force: "011111"
        })

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("#is-urgent").click()

        // TODO why is the page empty in cypress?
        cy.get("tr", { timeout: 10_000 }).not(":first").eq(0).contains("Urgent").should("not.exist")
      })
    })
  })
})

export {}
