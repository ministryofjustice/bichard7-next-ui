import { addDays, format, subDays, subMonths, subWeeks } from "date-fns"
import { TestTrigger } from "../../../test/utils/manageTriggers"
import hashedPassword from "../../fixtures/hashedPassword"
import a11yConfig from "../../support/a11yConfig"
import logAccessibilityViolations from "../../support/logAccessibilityViolations"
import { removeFilterChip } from "./filterChips.cy"

function showFilters() {
  cy.visit("/bichard")
  cy.get("button[id=filter-button]").click()
}

function collapseFilterSection(sectionToBeCollapsed: string, optionToBeCollapsed: string) {
  cy.contains(sectionToBeCollapsed).parent().parent().parent().find("button").click()
  cy.contains(optionToBeCollapsed).should("not.exist")
}

function expandFilterSection(sectionToBeExpanded: string, optionToBeExpanded: string) {
  cy.contains(sectionToBeExpanded).parent().parent().parent().find("button").click()
  cy.contains(optionToBeExpanded).should("exist")
}

function removeFilterTag(filterTag: string) {
  cy.get(".moj-filter-tags a.moj-filter__tag").contains(filterTag).click({ force: true })
}

function inputAndSearch(inputId: string, phrase: string) {
  cy.get(`input[id=${inputId}]`).type(phrase)
  cy.get("button[id=search]").click()
}

function confirmMultipleFieldsDisplayed(fields: string[]) {
  fields.forEach((field) => {
    cy.contains(field)
  })
}

function confirmMultipleFieldsNotDisplayed(fields: string[]) {
  fields.forEach((field) => {
    cy.contains(field).should("not.exist")
  })
}

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
      cy.login("bichard01@example.com", "password")
    })

    it("Should be accessible", () => {
      showFilters()
      cy.get("input[id=keywords]").type("Dummy")
      cy.get('[id="triggers-type"]').check()
      cy.get('[id="exceptions-type"]').check()

      cy.injectAxe()

      // Wait for the page to fully load
      cy.get("h1")

      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)

      cy.get("button[id=search]").click()

      // Wait for the page to fully load
      cy.get("h1")

      cy.injectAxe()
      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })

    it("Should expand and collapse case type filter navigation", () => {
      showFilters()

      cy.contains("Exceptions")

      collapseFilterSection("Case type", "Exceptions")
      expandFilterSection("Case type", "Exceptions")
    })

    it("Should expand and collapse court date filter navigation", () => {
      showFilters()

      cy.contains("Date range")

      collapseFilterSection("Court date", "Date range")
      expandFilterSection("Court date", "Date range")
    })

    it("Should expand and collapse urgency filter navigation", () => {
      showFilters()

      cy.contains("Urgent cases only")

      collapseFilterSection("Urgency", "Urgent cases only")
      expandFilterSection("Urgency", "Urgent cases only")
    })

    it("Should expand and collapse locked state filter navigation", () => {
      showFilters()

      cy.contains("Locked cases only")

      collapseFilterSection("Locked state", "Locked cases only")
      expandFilterSection("Locked state", "Locked cases only")
    })

    it("Should expand and collapse case state filter navigation", () => {
      showFilters()

      cy.contains("Unresolved & resolved cases")

      collapseFilterSection("Case state", "Unresolved & resolved cases")
      expandFilterSection("Case state", "Unresolved & resolved cases")
    })

    it("Should display cases filtered by defendant name", () => {
      cy.task("insertCourtCasesWithFields", [
        { defendantName: "Bruce Wayne", orgForPoliceFilter: "011111" },
        { defendantName: "Barbara Gordon", orgForPoliceFilter: "011111" },
        { defendantName: "Alfred Pennyworth", orgForPoliceFilter: "011111" }
      ])

      showFilters()

      inputAndSearch("keywords", "Bruce Wayne")
      cy.contains("Bruce Wayne")
      confirmMultipleFieldsNotDisplayed(["Barbara Gordon", "Alfred Pennyworth"])
      cy.get("tr").should("have.length", 2)
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Bruce Wayne")

      removeFilterTag("Bruce Wayne")
      confirmMultipleFieldsDisplayed(["Bruce Wayne", "Barbara Gordon", "Alfred Pennyworth"])
    })

    it("Should display cases filtered by court name", () => {
      cy.task("insertCourtCasesWithFields", [
        { courtName: "Manchester Court", orgForPoliceFilter: "011111" },
        { courtName: "London Court", orgForPoliceFilter: "011111" },
        { courtName: "Bristol Court", orgForPoliceFilter: "011111" }
      ])

      showFilters()

      inputAndSearch("court-name", "Manchester Court")
      cy.contains("Manchester Court")
      confirmMultipleFieldsNotDisplayed(["London Court", "Bristol Court"])
      cy.get("tr").should("have.length", 2)
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Manchester Court")

      // Removing filter tag
      removeFilterTag("Manchester Court")
      confirmMultipleFieldsDisplayed(["Manchester Court", "London Court", "Bristol Court"])
    })

    it("Should display cases filtered by PTIURN", () => {
      cy.task("insertCourtCasesWithFields", [
        { ptiurn: "Case00001", orgForPoliceFilter: "011111" },
        { ptiurn: "Case00002", orgForPoliceFilter: "011111" },
        { ptiurn: "Case00003", orgForPoliceFilter: "011111" }
      ])

      showFilters()

      inputAndSearch("ptiurn", "Case00001")
      cy.contains("Case00001")
      confirmMultipleFieldsNotDisplayed(["Case00002", "Case00003"])
      cy.get("tr").should("have.length", 2)
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Case00001")

      // Removing filter tag
      removeFilterTag("Case00001")
      confirmMultipleFieldsDisplayed(["Case00001", "Case00002", "Case00003"])
    })

    it("Should display cases filtered by reason", () => {
      cy.task("insertCourtCasesWithFields", [
        { orgForPoliceFilter: "011111" },
        { orgForPoliceFilter: "011111" },
        { orgForPoliceFilter: "011111" }
      ])

      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0107",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })
      cy.task("insertException", { caseId: 1, exceptionCode: "HO200212", errorReport: "HO200212||ds:Reason" })

      showFilters()

      inputAndSearch("reason-search", "TRPR0107")
      cy.contains("Case00000")
      confirmMultipleFieldsNotDisplayed(["Case00001", "Case00002"])
      cy.get("tr").should("have.length", 3)
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("TRPR0107")
      removeFilterTag("TRPR0107")

      cy.get("button[id=filter-button]").click()

      inputAndSearch("reason-search", "HO200212")
      cy.contains("Case00001")
      confirmMultipleFieldsNotDisplayed(["Case00000", "Case00002"])
      cy.get("tr").should("have.length", 2)
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("HO200212")

      // Removing filter tag
      removeFilterTag("HO200212")
      confirmMultipleFieldsDisplayed(["Case00000", "Case00001", "Case00002"])
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

      cy.task("insertCourtCasesWithFields", [
        { courtDate: todayDate, orgForPoliceFilter: force },
        { courtDate: yesterdayDate, orgForPoliceFilter: force },
        { courtDate: tomorrowDate, orgForPoliceFilter: force },
        { courtDate: oneWeekAgoDate, orgForPoliceFilter: force },
        { courtDate: oneWeekAndOneDayAgoDate, orgForPoliceFilter: force },
        { courtDate: twoWeeksAgoDate, orgForPoliceFilter: force },
        { courtDate: oneMonthAgoDate, orgForPoliceFilter: force },
        { courtDate: aLongTimeAgoDate, orgForPoliceFilter: force }
      ])

      showFilters()

      // Tests for "Today"
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

      removeFilterTag("Today")
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

      removeFilterTag("Yesterday")
      cy.get("tr").not(":first").should("have.length", 5)

      // Tests for "This week"
      cy.get("button#filter-button").click()
      cy.get("#date-range").click()
      cy.get('label[for="date-range-this-week"]').should("have.text", expectedThisWeekLabel)
      cy.get("#date-range-this-week").click()
      cy.get("button#search").click()

      cy.get("tr").not(":first").should("have.length", 3)
      confirmMultipleFieldsDisplayed([
        todayDateString,
        yesterdayDateString,
        oneWeekAgoDateString,
        "Case00000",
        "Case00001",
        "Case00003"
      ])

      removeFilterTag("This week")
      cy.get("tr").not(":first").should("have.length", 5)

      // Tests for "Last week"
      cy.get("button#filter-button").click()
      cy.get("#date-range").click()
      cy.get('label[for="date-range-last-week"]').should("have.text", expectedLastWeekLabel)
      cy.get("#date-range-last-week").click()
      cy.get("button#search").click()

      cy.get("tr").not(":first").should("have.length", 3)
      confirmMultipleFieldsDisplayed([
        oneWeekAgoDateString,
        oneWeekAndOneDayAgoDateString,
        twoWeeksAgoDateString,
        "Case00003",
        "Case00004",
        "Case00005"
      ])

      removeFilterTag("Last week")
      cy.get("tr").not(":first").should("have.length", 5)

      // Tests for "This month"
      cy.get("button#filter-button").click()
      cy.get("#date-range").click()
      cy.get('label[for="date-range-this-month"]').should("have.text", expectedThisMonthLabel)
      cy.get("#date-range-this-month").click()
      cy.get("button#search").click()

      cy.get("tr").not(":first").should("have.length", 5)
      confirmMultipleFieldsDisplayed([
        todayDateString,
        yesterdayDateString,
        oneWeekAgoDateString,
        twoWeeksAgoDateString,
        oneWeekAndOneDayAgoDateString,
        "Case00000",
        "Case00001",
        "Case00003",
        "Case00004",
        "Case00005"
      ])

      cy.findByText("Next page").should("exist")
      cy.findByText("Next page").click()
      cy.get("tr").not(":first").should("have.length", 1)

      confirmMultipleFieldsDisplayed([oneMonthAgoDateString, "Case00006"])

      removeFilterTag("This month")
      cy.get("tr").not(":first").should("have.length", 5)
    })

    it("Should not allow passing an invalid date range filter", () => {
      const force = "011111"
      cy.task("insertCourtCasesWithFields", [
        { courtDate: new Date(), orgForPoliceFilter: force },
        { courtDate: subDays(new Date(), 1), orgForPoliceFilter: force },
        { courtDate: addDays(new Date(), 1), orgForPoliceFilter: force }
      ])

      cy.visit("/bichard?dateRange=invalid")
      cy.get("tr").not(":first").should("have.length", 3)
    })

    it("Should filter cases by whether they have triggers and exceptions", () => {
      cy.task("insertCourtCasesWithFields", [
        { orgForPoliceFilter: "011111" },
        { orgForPoliceFilter: "011111" },
        { orgForPoliceFilter: "011111" },
        { orgForPoliceFilter: "011111" }
      ])
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
      confirmMultipleFieldsDisplayed([`Case00000`, `Case00001`, `Case00002`, `Case00003`])

      // Filtering by having triggers
      cy.get("button[id=filter-button]").click()
      cy.get('[id="triggers-type"]').check()
      cy.get("button[id=search]").click()

      cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

      confirmMultipleFieldsDisplayed([`Case00000`, `Case00001`])
      confirmMultipleFieldsNotDisplayed(["Case00002", "Case00003"])

      // Filtering by having exceptions
      removeFilterTag("Triggers")
      cy.get("button[id=filter-button]").click()
      cy.get('[id="exceptions-type"]').check()
      cy.get("button[id=search]").click()

      cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")

      confirmMultipleFieldsDisplayed([`Case00000`, `Case00002`])
      confirmMultipleFieldsNotDisplayed([`Case00001`, `Case00003`])

      // Filter for both triggers and exceptions
      cy.get("button[id=filter-button]").click()
      cy.get('[id="triggers-type"]').check()
      cy.get('[id="exceptions-type"]').check()
      cy.get("button[id=search]").click()

      cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")
      cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

      confirmMultipleFieldsDisplayed([`Case00000`, `Case00001`])

      // Removing exceptions filter tag
      removeFilterTag("Exceptions")
      confirmMultipleFieldsDisplayed([`Case00000`, `Case00001`])
      confirmMultipleFieldsNotDisplayed([`Case00002`, `Case00003`])

      // Removing triggers filter tag
      removeFilterTag("Triggers")
      confirmMultipleFieldsDisplayed([`Case00000`, `Case00001`, `Case00002`, `Case00003`])
    })

    it("Should filter cases by urgency", () => {
      const force = "011111"
      cy.task(
        "insertCourtCasesWithFields",
        [true, false, true, true].map((urgency) => ({
          isUrgent: urgency,
          orgForPoliceFilter: force
        }))
      )

      showFilters()
      cy.get("#urgent").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 3)
      cy.get("tr")
        .not(":first")
        .each((row) => {
          cy.wrap(row).contains("Urgent").should("exist")
        })

      // Removing urgent filter tag all case should be shown with the filter disabled
      removeFilterTag("Urgent")
      cy.get("tr").not(":first").should("have.length", 4)

      // Filter for non-urgent cases
      cy.get("button[id=filter-button]").click()
      cy.get("#non-urgent").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 1)
      cy.contains("Case00001")

      // Removing non-urgent filter tag all case should be shown with the filter disabled
      removeFilterTag("Non-urgent")
      cy.get("tr").not(":first").should("have.length", 4)
    })

    it("Should filter cases by case state", () => {
      const resolutionTimestamp = new Date()
      const force = "011111"
      cy.task("insertCourtCasesWithFields", [
        { resolutionTimestamp: null, orgForPoliceFilter: force },
        { resolutionTimestamp: resolutionTimestamp, orgForPoliceFilter: force },
        { resolutionTimestamp: resolutionTimestamp, orgForPoliceFilter: force },
        { resolutionTimestamp: resolutionTimestamp, orgForPoliceFilter: force }
      ])

      showFilters()

      // Filter for resolved and unresolved cases
      cy.get("#unresolved-and-resolved").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 4)
      cy.contains("Case00000")

      // Removing case state filter tag unresolved cases should be shown with the filter disabled
      removeFilterTag("Unresolved & resolved cases")
      cy.get("tr").not(":first").should("have.length", 1)

      // Filter for resolved cases
      cy.get("button[id=filter-button]").click()
      cy.get("#resolved").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 3)
      cy.contains("Case00001")

      // Removing case state filter tag unresolved cases should be shown with the filter disabled
      removeFilterTag("Resolved cases")
      cy.get("tr").not(":first").should("have.length", 1)
    })

    it("Should filter cases by locked state", () => {
      cy.task("insertCourtCasesWithFields", [
        { errorLockedByUsername: "Bichard01", triggerLockedByUsername: "Bichard01", orgForPoliceFilter: "011111" },
        { orgForPoliceFilter: "011111" }
      ])

      showFilters()
      // Filter for locked cases
      cy.get("#locked").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 1)
      cy.contains("Case00000")

      // Removing locked filter tag all case should be shown with the filter disabled
      removeFilterTag("Locked")
      cy.get("tr").not(":first").should("have.length", 2)

      // Filter for unlocked cases
      cy.get("button[id=filter-button]").click()
      cy.get("#unlocked").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 1)
      cy.contains("Case00001")

      // Removing unlocked filter tag all case should be shown with the filter disabled
      removeFilterTag("Unlocked")
      cy.get("tr").not(":first").should("have.length", 2)
    })

    it("Should clear filters", () => {
      showFilters()
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

    describe("Filtering cases allocated to me", () => {
      it.only("Should filter cases that I hold the trigger lock for", () => {
        // cy.task("insertCourtCasesWithFields", [
        //   {
        //     errorLockedByUsername: "Bichard01",
        //     triggerLockedByUsername: "Bichard01"
        //   },
        //   { errorLockedByUsername: "Bichard01", triggerLockedByUsername: "Bichard01" },
        //   {
        //     errorLockedByUsername: "Bichard02",
        //     triggerLockedByUsername: "Bichard02"
        //   },
        //   {
        //     errorLockedByUsername: "Bichard03",
        //     triggerLockedByUsername: "Bichard03"
        //   }
        // ])

        cy.task("insertCourtCasesWithFields", [
          { errorLockedByUsername: "Bichard01", triggerLockedByUsername: "Bichard01", orgForPoliceFilter: "011111" },
          { orgForPoliceFilter: "011111" },
          { errorLockedByUsername: "Bichard02", triggerLockedByUsername: "Bichard02", orgForPoliceFilter: "011111" },
          { orgForPoliceFilter: "011111" }
        ])

        showFilters()

        cy.get("#my-cases-filter").click()
        cy.contains("Selected filters")
        cy.contains("My cases")
        cy.contains("Case00000")
        confirmMultipleFieldsNotDisplayed(["Case00001", "Case00002", "Case00003"])
        // removeFilterChip()
        // cy.get("#my-cases-filter").should("not.be.checked")

        confirmMultipleFieldsDisplayed([])
      })
    })
  })
})

export {}
