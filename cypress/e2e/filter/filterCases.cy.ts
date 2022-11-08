import { TestTrigger } from "../../../test/utils/manageTriggers"
import a11yConfig from "../../support/a11yConfig"
import logAccessibilityViolations from "../../support/logAccessibilityViolations"
import hashedPassword from "../../fixtures/hashedPassword"

describe("Case list", () => {
  context("When filters applied", () => {
    before(() => {
      cy.task("clearUsers")
      cy.task("insertUsers", {
        users: [
          {
            username: "Bichard01",
            visibleForces: ["011111"],
            forenames: "Bichard Test User",
            surname: "01",
            email: "bichard01@example.com",
            password: hashedPassword
          }
        ],
        userGroups: ["B7NewUI_grp"]
      })
    })

    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.viewport(1280, 720)
      cy.login("bichard01@example.com", "password")
    })

    it("Should be accessible", () => {
      cy.visit("/bichard")

      cy.get("button[id=filter-button]").click()
      cy.get("input[id=keywords]").type("Dummy")
      cy.get('[id="triggers-type"]').check()
      cy.get('[id="exceptions-type"]').check()

      cy.injectAxe()
      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)

      cy.get("button[id=search]").click()

      cy.injectAxe()
      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })

    it("Should display cases filtered by defendant name", () => {
      cy.task("insertCourtCasesWithDefendantNames", {
        defendantNames: ["Bruce Wayne", "Barbara Gordon", "Alfred Pennyworth"],
        force: "011111"
      })

      cy.visit("/bichard")

      cy.get("button[id=filter-button]").click()
      cy.get("input[id=keywords]").type("Bruce Wayne")

      cy.get("button[id=search]").click()
      cy.get("tr").not(":first").get("td:nth-child(3)").contains("Bruce Wayne")
      cy.get("tr").not(":first").get("td:nth-child(3)").contains("Barbara Gordon").should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(3)").contains("Alfred Pennyworth").should("not.exist")
      cy.get("tr").should("have.length", 2)
      cy.get('*[class^="moj-filter-tags"]').contains("Bruce Wayne")

      // Removing filter tag
      cy.get('*[class^="moj-filter-tags"]').contains("Bruce Wayne").click()
      cy.get("tr").not(":first").get("td:nth-child(3)").contains("Bruce Wayne")
      cy.get("tr").not(":first").get("td:nth-child(3)").contains("Barbara Gordon")
      cy.get("tr").not(":first").get("td:nth-child(3)").contains("Alfred Pennyworth")
    })

    it("Should filter cases by whether they have triggers and exceptions", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["011111", "011111", "011111", "011111"])
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

      cy.visit("/bichard")

      // Default: no filter, all cases shown
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00002`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00003`)

      // Filtering by having triggers
      cy.get("button[id=filter-button]").click()
      cy.get('[id="triggers-type"]').check()
      cy.get("button[id=search]").click()

      cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00002`).should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00003`).should("not.exist")

      // Filtering by having exceptions
      cy.get('*[class^="moj-filter-tags"]').contains("Triggers").click() // Removing triggers filter tag
      cy.get("button[id=filter-button]").click()
      cy.get('[id="exceptions-type"]').check()
      cy.get("button[id=search]").click()

      cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")

      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`).should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00002`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00003`).should("not.exist")

      // Filter for both triggers and exceptions
      cy.get("button[id=filter-button]").click()
      cy.get('[id="triggers-type"]').check()
      cy.get('[id="exceptions-type"]').check()
      cy.get("button[id=search]").click()

      cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")
      cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)

      // Removing exceptions filter tag
      cy.get('*[class^="moj-filter-tags"]').contains("Exceptions").click()

      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00002`).should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00003`).should("not.exist")

      // Removing triggers filter tag
      cy.get('*[class^="moj-filter-tags"]').contains("Triggers").click()

      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00001`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00002`)
      cy.get("tr").not(":first").get("td:nth-child(2)").contains(`Case00003`)
    })

    it("Should filter cases by urgency", () => {
      cy.task("insertCourtCasesWithUrgencies", {
        urgencies: [true, false, true, false, true, false, false],
        force: "011111"
      })

      cy.visit("/bichard")

      cy.get("button[id=filter-button]").click()
      cy.get("#is-urgent-filter").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 3)
      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).contains("Urgent").should("exist")
        })

      // Removing urgent filter tag a non-urgent case should be shown with the filter disabled
      cy.get('*[class^="moj-filter-tags"]').contains("Urgent").click()
      cy.get("tr").contains("Case00001").should("exist")
    })

    it("Should clear filters", () => {
      cy.visit("/bichard")

      cy.get("button[id=filter-button]").click()
      cy.get("input[id=keywords]").type("Dummy")
      cy.get('[id="triggers-type"]').check()
      cy.get('[id="exceptions-type"]').check()
      cy.get("button[id=search]").click()

      cy.get('*[class^="moj-filter-tags"]').contains("Dummy")
      cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")
      cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

      cy.get("#clear-filters-applied").click()

      cy.get('*[class^="moj-filter-tags"]').should("not.exist")
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq("/bichard")
      })
    })
  })
})

export {}
