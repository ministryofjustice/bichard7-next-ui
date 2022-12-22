import { TestTrigger } from "../../../test/utils/manageTriggers"
import a11yConfig from "../../support/a11yConfig"
import logAccessibilityViolations from "../../support/logAccessibilityViolations"
import hashedPassword from "../../fixtures/hashedPassword"
import { addDays, format, subDays, subMonths, subWeeks } from "date-fns"

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

    it("Should expand and collapse case type filter navigation", () => {
      cy.visit("/bichard")
      cy.get("button[id=filter-button]").click()

      cy.contains("Exceptions").should("exist")

      cy.contains("Case type").parent().parent().parent().find("button").click()
      cy.contains("Exceptions").should("not.exist")

      cy.contains("Case type").parent().parent().parent().find("button").click()
      cy.contains("Exceptions").should("exist")
    })

    it("Should expand and collapse court date filter navigation", () => {
      cy.visit("/bichard")
      cy.get("button[id=filter-button]").click()

      cy.contains("Date range").should("exist")

      cy.contains("Court date").parent().parent().parent().find("button").click()
      cy.contains("Date range").should("not.exist")

      cy.contains("Court date").parent().parent().parent().find("button").click()
      cy.contains("Date range").should("exist")
    })

    it("Should expand and collapse urgency filter navigation", () => {
      cy.visit("/bichard")
      cy.get("button[id=filter-button]").click()

      cy.contains("Urgent cases only").should("exist")

      cy.contains("Urgency").parent().parent().parent().find("button").click()
      cy.contains("Urgent cases only").should("not.exist")

      cy.contains("Urgency").parent().parent().parent().find("button").click()
      cy.contains("Urgent cases only").should("exist")
    })

    it("Should expand and collapse locked state filter navigation", () => {
      cy.visit("/bichard")
      cy.get("button[id=filter-button]").click()

      cy.contains("Locked cases only").should("exist")

      cy.contains("Locked state").parent().parent().parent().find("button").click()
      cy.contains("Locked cases only").should("not.exist")

      cy.contains("Locked state").parent().parent().parent().find("button").click()
      cy.contains("Locked cases only").should("exist")
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

    it("Should display cases filtered for a named date range", () => {
      const force = "011111"

      const todayDate = new Date()
      const yesterdayDate = subDays(todayDate, 1)
      const tomorrowDate = addDays(todayDate, 1)
      const oneWeekAgoDate = subWeeks(todayDate, 1)
      const oneWeekAndOneDayAgoDate = subDays(todayDate, 8)
      const twoWeeksAgoDate = subWeeks(todayDate, 2)
      const oneMonthAgoDate = subMonths(todayDate, 1)
      const aLongTimeAgoDate = new Date("2001-09-26")

      const dateFormatString = "dd/MM/yyyy"
      const todayDateString = format(todayDate, dateFormatString)
      const yesterdayDateString = format(yesterdayDate, dateFormatString)
      const oneWeekAgoDateString = format(oneWeekAgoDate, dateFormatString)
      const oneWeekAndOneDayAgoDateString = format(oneWeekAndOneDayAgoDate, dateFormatString)
      const twoWeeksAgoDateString = format(twoWeeksAgoDate, dateFormatString)
      const oneMonthAgoDateString = format(oneMonthAgoDate, dateFormatString)

      const expectedThisWeekLabel = `This week (${oneWeekAgoDateString} - ${todayDateString})`
      const expectedLastWeekLabel = `Last week (${twoWeeksAgoDateString} - ${oneWeekAgoDateString})`
      const expectedThisMonthLabel = `This month (${oneMonthAgoDateString} - ${todayDateString})`

      cy.task("insertCourtCasesWithCourtDates", {
        courtDate: [
          todayDate,
          yesterdayDate,
          tomorrowDate,
          oneWeekAgoDate,
          oneWeekAndOneDayAgoDate,
          twoWeeksAgoDate,
          oneMonthAgoDate,
          aLongTimeAgoDate
        ],
        force
      })

      cy.visit("/bichard")

      // Tests for "Today"
      cy.get("button#filter-button").click()
      cy.get("#date-range").click()
      cy.get("#date-range-today").click()
      cy.get("button#search").click()

      cy.get("tr").not(":first").should("have.length", 1)
      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).contains(todayDateString).should("exist")
          cy.wrap(row).contains("Case00000").should("exist")
        })

      cy.get(".moj-filter-tags").contains("Today").click()
      cy.get("tr").not(":first").should("have.length", 5)

      // Tests for "yesterday"
      cy.get("button#filter-button").click()
      cy.get("#date-range").click()
      cy.get("#date-range-yesterday").click()
      cy.get("button#search").click()

      cy.get("tr").not(":first").should("have.length", 1)
      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).contains(yesterdayDateString).should("exist")
          cy.wrap(row).contains("Case00001").should("exist")
        })

      cy.get(".moj-filter-tags").contains("Yesterday").click()
      cy.get("tr").not(":first").should("have.length", 5)

      // Tests for "This week"
      cy.get("button#filter-button").click()
      cy.get("#date-range").click()
      cy.get('label[for="date-range-this-week"]').should("have.text", expectedThisWeekLabel)
      cy.get("#date-range-this-week").click()
      cy.get("button#search").click()

      cy.get("tr").not(":first").should("have.length", 3)
      cy.get("tr").not(":first").contains(todayDateString).should("exist")
      cy.get("tr").not(":first").contains(yesterdayDateString).should("exist")
      cy.get("tr").not(":first").contains(oneWeekAgoDateString).should("exist")
      cy.get("tr").not(":first").contains("Case00000").should("exist")
      cy.get("tr").not(":first").contains("Case00001").should("exist")
      cy.get("tr").not(":first").contains("Case00003").should("exist")

      cy.get(".moj-filter-tags").contains("This week").click()
      cy.get("tr").not(":first").should("have.length", 5)

      // Tests for "Last week"
      cy.get("button#filter-button").click()
      cy.get("#date-range").click()
      cy.get('label[for="date-range-last-week"]').should("have.text", expectedLastWeekLabel)
      cy.get("#date-range-last-week").click()
      cy.get("button#search").click()

      cy.get("tr").not(":first").should("have.length", 3)
      cy.get("tr").not(":first").contains(oneWeekAgoDateString).should("exist")
      cy.get("tr").not(":first").contains(oneWeekAndOneDayAgoDateString).should("exist")
      cy.get("tr").not(":first").contains(twoWeeksAgoDateString).should("exist")
      cy.get("tr").not(":first").contains("Case00003").should("exist")
      cy.get("tr").not(":first").contains("Case00004").should("exist")
      cy.get("tr").not(":first").contains("Case00005").should("exist")

      cy.get(".moj-filter-tags").contains("Last week").click()
      cy.get("tr").not(":first").should("have.length", 5)

      // Tests for "This month"
      cy.get("button#filter-button").click()
      cy.get("#date-range").click()
      cy.get('label[for="date-range-this-month"]').should("have.text", expectedThisMonthLabel)
      cy.get("#date-range-this-month").click()
      cy.get("button#search").click()

      cy.get("tr").not(":first").should("have.length", 5)
      cy.get("tr").not(":first").contains(todayDateString).should("exist")
      cy.get("tr").not(":first").contains(yesterdayDateString).should("exist")
      cy.get("tr").not(":first").contains(oneWeekAgoDateString).should("exist")
      cy.get("tr").not(":first").contains(twoWeeksAgoDateString).should("exist")
      cy.get("tr").not(":first").contains(oneWeekAndOneDayAgoDateString).should("exist")

      cy.get("tr").not(":first").contains("Case00000").should("exist")
      cy.get("tr").not(":first").contains("Case00001").should("exist")
      cy.get("tr").not(":first").contains("Case00003").should("exist")
      cy.get("tr").not(":first").contains("Case00004").should("exist")
      cy.get("tr").not(":first").contains("Case00005").should("exist")

      cy.findByText("Next page").should("exist")
      cy.findByText("Next page").click()
      cy.get("tr").not(":first").should("have.length", 1)

      cy.get("tr").not(":first").contains(oneMonthAgoDateString).should("exist")
      cy.get("tr").not(":first").contains("Case00006").should("exist")

      cy.get(".moj-filter-tags").contains("This month").click()
      cy.get("tr").not(":first").should("have.length", 5)
    })

    it("Should not allow passing an invalid date range filter", () => {
      cy.task("insertCourtCasesWithCourtDates", {
        courtDate: [new Date(), subDays(new Date(), 1), addDays(new Date(), 1)],
        force: "011111"
      })

      cy.visit("/bichard?dateRange=invalid")
      cy.get("tr").not(":first").should("have.length", 3)
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
        urgencies: [true, false, true, true],
        force: "011111"
      })

      cy.visit("/bichard")

      cy.get("button[id=filter-button]").click()
      cy.get("#urgent").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 3)
      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).contains("Urgent").should("exist")
        })

      // Removing urgent filter tag all case should be shown with the filter disabled
      cy.get('*[class^="moj-filter-tags"]').contains("Urgent").click()
      cy.get("tr").not(":first").should("have.length", 4)

      // Filter for non-urgent cases
      cy.get("button[id=filter-button]").click()
      cy.get("#non-urgent").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 1)
      cy.get("tr").contains("Case00001").should("exist")

      // Removing non-urgent filter tag all case should be shown with the filter disabled
      cy.get('*[class^="moj-filter-tags"]').contains("Non-urgent").click()
      cy.get("tr").not(":first").should("have.length", 4)
    })

    it("Should filter cases by locked state", () => {
      cy.task("insertMultipleDummyCourtCasesWithLock", {
        lockHolders: [
          {
            errorLockedByUsername: "Bichard01",
            triggerLockedByUsername: "Bichard01"
          },
          {}
        ],
        orgCode: "011111"
      })

      cy.visit("/bichard")

      // Filter for locked cases
      cy.get("button[id=filter-button]").click()
      cy.get("#locked").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 1)
      cy.get("tr").not(":first").contains("Case00000").should("exist")

      // Removing locked filter tag all case should be shown with the filter disabled
      cy.get('*[class^="moj-filter-tags"]').contains("Locked").click()
      cy.get("tr").not(":first").should("have.length", 2)

      // Filter for unlocked cases
      cy.get("button[id=filter-button]").click()
      cy.get("#unlocked").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 1)
      cy.get("tr").contains("Case00001").should("exist")

      // Removing unlocked filter tag all case should be shown with the filter disabled
      cy.get('*[class^="moj-filter-tags"]').contains("Unlocked").click()
      cy.get("tr").not(":first").should("have.length", 2)
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
