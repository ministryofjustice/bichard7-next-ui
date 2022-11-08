import User from "services/entities/User"
import a11yConfig from "../support/a11yConfig"
import logAccessibilityViolations from "../support/logAccessibilityViolations"
import hashedPassword from "../fixtures/hashedPassword"

describe("Case list", () => {
  context("720p resolution", () => {
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

    before(() => {
      cy.task("clearUsers")
      cy.task("insertUsers", { users: defaultUsers, userGroups: ["B7NewUI_grp"] })
    })

    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.viewport(1280, 720)
    })

    context("when there are 0 cases", () => {
      it("should display 0 cases and the user's username when no cases are added", () => {
        const userEmail = "bichard01@example.com"
        // cy.task("insertIntoUserGroup", { emailAddress: userEmail, groupName: "B7NewUI_grp" })
        cy.login(userEmail, "password")

        cy.visit("/bichard")

        cy.findByText("There are no court cases to show").should("exist")
      })

      it("should not show pagination buttons when there are 0 cases", () => {
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.findByText("Previous page").should("not.exist")
        cy.findByText("Next page").should("not.exist")
      })

      it("should be accessible", () => {
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.injectAxe()

        cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
      })
    })

    context("when there multiple cases", () => {
      it("should be accessible", () => {
        cy.task("insertMultipleDummyCourtCases", { numToInsert: 50, force: "01" })
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.injectAxe()

        cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
      })

      it("should display multiple cases", () => {
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
        cy.task("insertCourtCasesWithOrgCodes", ["01"])
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
      })

      it("should only display cases visible to users forces", () => {
        cy.task("insertCourtCasesWithOrgCodes", ["01", "02", "03", "04"])

        cy.login("bichard02@example.com", "password")
        cy.visit("/bichard")

        cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)
      })

      it("should display cases for sub-forces", () => {
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
        cy.task("insertCourtCasesWithOrgCodes", ["01", "011", "0111", "01111", "011111"])

        cy.login("bichard011111@example.com", "password")
        cy.visit("/bichard")

        cy.get("tr").not(":first").get("td:nth-child(2)").contains("Case00000").should("not.exist")
        cy.get("tr").not(":first").get("td:nth-child(2)").contains("Case00001").should("not.exist")
        cy.get("tr").not(":first").get("td:nth-child(2)").contains("Case00002")
        cy.get("tr").not(":first").get("td:nth-child(2)").contains("Case00003")
        cy.get("tr").not(":first").get("td:nth-child(2)").contains("Case00004")
      })

      it("can display cases ordered by court name", () => {
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

      it("should be able to navigate to the case details page and back", () => {
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
        cy.task("insertCourtCasesWithUrgencies", { urgencies: [true, false, true], force: "01" })

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("tr").not(":first").eq(0).get("td:nth-child(2)").contains(`Case00000`)
        cy.get("tr").not(":first").eq(0).contains(`Urgent`).should("exist")
        cy.get("tr").not(":first").eq(1).contains(`Urgent`).should("not.exist")
        cy.get("tr").not(":first").eq(2).contains(`Urgent`).should("exist")
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

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("tr").not(":first").eq(0).get("td:nth-child(2)").contains(`Case00000`)
        cy.get("tr").not(":first").eq(0).get("td:nth-child(6)").should("be.empty")
        cy.get("tr").not(":first").eq(1).get("td:nth-child(6)").contains(`1`).should("exist")
        cy.get("tr").not(":first").eq(2).get("td:nth-child(6)").contains(`3`).should("exist")
      })

      it("can display cases ordered by urgency", () => {
        cy.task("insertCourtCasesWithUrgencies", {
          urgencies: [false, false, true, false, true, true, false, true, false, true],
          force: "011111"
        })

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.get("#is-urgent-sort").click()

        cy.get("tr")
          .not(":first")
          .each((row) => {
            cy.wrap(row).contains(`Urgent`).should("not.exist")
          })

        cy.get("#is-urgent-sort").click()

        cy.get("tr")
          .not(":first")
          .each((row) => {
            cy.wrap(row).contains(`Urgent`).should("exist")
          })
      })
    })
  })
})

export {}
