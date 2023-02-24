import { addDays, format, subDays, subMonths, subWeeks } from "date-fns"
import { TestTrigger } from "../../../test/utils/manageTriggers"
import hashedPassword from "../../fixtures/hashedPassword"
import a11yConfig from "../../support/a11yConfig"
import { confirmFiltersAppliedContains, exactMatch } from "../../support/helpers"
import logAccessibilityViolations from "../../support/logAccessibilityViolations"

function visitBasePathAndShowFilters() {
  cy.visit("/bichard")
  cy.get("button[id=filter-button]").click()
}

function collapseFilterSection(sectionToBeCollapsed: string, optionToBeCollapsed: string) {
  cy.contains(exactMatch(sectionToBeCollapsed), { matchCase: true }).parent().parent().parent().find("button").click()
  cy.get(optionToBeCollapsed).should("not.exist")
}

function expandFilterSection(sectionToBeExpanded: string, optionToBeExpanded: string) {
  cy.contains(exactMatch(sectionToBeExpanded), { matchCase: true }).parent().parent().parent().find("button").click()
  cy.get(optionToBeExpanded).should("exist")
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

    it("Should be accessible with conditional radio buttons opened", () => {
      visitBasePathAndShowFilters()
      cy.contains("Court date").parent().parent().parent().find("button").click()
      cy.get("#date-range").should("not.be.visible")
      expandFilterSection("Court date", "#date-range")

      cy.injectAxe()

      // Wait for the page to fully load
      cy.get("h1")

      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })

    it("Should be accessible", () => {
      visitBasePathAndShowFilters()
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

    it("Should expand and collapse reason filter navigation", () => {
      visitBasePathAndShowFilters()

      cy.contains("Exceptions")

      collapseFilterSection("Reason", "#exceptions-type")
      expandFilterSection("Reason", "#exceptions-type")
    })

    it("Should expand and collapse court date filter navigation with the ratio conditional sections collapsed after the second expand", () => {
      visitBasePathAndShowFilters()

      cy.contains("Date range")

      cy.contains("Court date").parent().parent().parent().find("button").click()
      cy.get("#date-range").should("not.be.visible")
      expandFilterSection("Court date", "#date-range")

      // Custom date range & date range are collapsed
      cy.get("#date-from").should("not.be.visible")
      cy.get("#date-range-yesterday").should("not.be.visible")
      // Opening custom date range collapses date range & opens custom date range
      cy.get("#custom-date-range").click()
      cy.get("#date-from").should("be.visible")
      cy.get("#date-range-yesterday").should("not.be.visible")
    })

    it("Should remove the selection of the date range when it's been changed to the custom date range", () => {
      visitBasePathAndShowFilters()
      cy.get("#date-range").click()
      cy.get("#date-range-yesterday").click()
      cy.get("#date-range-yesterday").should("be.checked")
      cy.get("#custom-date-range").click()
      cy.get("#date-range").click()
      cy.get("#date-range-yesterday").should("not.be.checked")
    })

    it("Should remove the selection of the custom date range when it's been changed to the date range", () => {
      visitBasePathAndShowFilters()
      cy.get("#custom-date-range").click()
      cy.get("#date-from").type("2022-01-01")
      cy.get("#date-to").type("2022-12-31")
      cy.get("#custom-date-range").should("be.checked")
      cy.get("#date-range").click()
      cy.get("#date-range-yesterday").click()
      cy.get("#date-range").should("be.checked")
      cy.get("#date-range-yesterday").should("be.checked")
    })

    it("Should only have the checked attribute for the selected date range ratio button", () => {
      visitBasePathAndShowFilters()
      // no selection, nothing is checked
      cy.get("#date-range").should("not.be.checked")
      cy.get("#custom-date-range").should("not.be.checked")
      // #date-range-yesterday selected, #date-range is checked
      cy.get("#date-range").click()
      cy.get("#date-range-yesterday").click()
      cy.get("#date-range").should("be.checked")
      cy.get("#custom-date-range").should("not.be.checked")
      // #custom-date-range, ##custom-date-range is checked
      cy.get("#custom-date-range").click()
      cy.get("#date-range").should("not.be.checked")
      cy.get("#custom-date-range").should("be.checked")
    })

    it("Should expand and collapse urgency filter navigation", () => {
      visitBasePathAndShowFilters()

      cy.contains("Urgent cases only")

      collapseFilterSection("Urgency", "#urgent")
      expandFilterSection("Urgency", "#urgent")
    })

    it("Should expand and collapse locked state filter navigation", () => {
      visitBasePathAndShowFilters()

      cy.contains("Locked cases only")

      collapseFilterSection("Locked state", "#locked")
      expandFilterSection("Locked state", "#locked")
    })

    it("Should expand and collapse case state filter navigation", () => {
      visitBasePathAndShowFilters()

      cy.contains("Unresolved & resolved cases")

      collapseFilterSection("Case state", "#unresolved-and-resolved")
      expandFilterSection("Case state", "#unresolved-and-resolved")
    })

    it("Should display cases filtered by defendant name", () => {
      cy.task("insertCourtCasesWithFields", [
        { defendantName: "Bruce Wayne", orgForPoliceFilter: "011111" },
        { defendantName: "Barbara Gordon", orgForPoliceFilter: "011111" },
        { defendantName: "Alfred Pennyworth", orgForPoliceFilter: "011111" }
      ])

      visitBasePathAndShowFilters()

      inputAndSearch("keywords", "Bruce Wayne")
      cy.contains("Bruce Wayne")
      confirmMultipleFieldsNotDisplayed(["Barbara Gordon", "Alfred Pennyworth"])
      cy.get("tr").should("have.length", 2)
      confirmFiltersAppliedContains("Bruce Wayne")

      removeFilterTag("Bruce Wayne")
      confirmMultipleFieldsDisplayed(["Bruce Wayne", "Barbara Gordon", "Alfred Pennyworth"])
    })

    it("Should display cases filtered by court name", () => {
      cy.task("insertCourtCasesWithFields", [
        { courtName: "Manchester Court", orgForPoliceFilter: "011111" },
        { courtName: "London Court", orgForPoliceFilter: "011111" },
        { courtName: "Bristol Court", orgForPoliceFilter: "011111" }
      ])

      visitBasePathAndShowFilters()

      inputAndSearch("court-name", "Manchester Court")
      cy.contains("Manchester Court")
      confirmMultipleFieldsNotDisplayed(["London Court", "Bristol Court"])
      cy.get("tr").should("have.length", 2)
      confirmFiltersAppliedContains("Manchester Court")

      removeFilterTag("Manchester Court")
      confirmMultipleFieldsDisplayed(["Manchester Court", "London Court", "Bristol Court"])
    })

    it("Should display cases filtered by PTIURN", () => {
      cy.task("insertCourtCasesWithFields", [
        { ptiurn: "Case00001", orgForPoliceFilter: "011111" },
        { ptiurn: "Case00002", orgForPoliceFilter: "011111" },
        { ptiurn: "Case00003", orgForPoliceFilter: "011111" }
      ])

      visitBasePathAndShowFilters()

      inputAndSearch("ptiurn", "Case00001")
      cy.contains("Case00001")
      confirmMultipleFieldsNotDisplayed(["Case00002", "Case00003"])
      cy.get("tr").should("have.length", 2)
      confirmFiltersAppliedContains("Case00001")

      removeFilterTag("Case00001")
      confirmMultipleFieldsDisplayed(["Case00001", "Case00002", "Case00003"])
    })

    it("Should display cases filtered by reason code", () => {
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

      visitBasePathAndShowFilters()

      inputAndSearch("reason-code", "TRPR0107")
      cy.contains("Case00000")
      confirmMultipleFieldsNotDisplayed(["Case00001", "Case00002"])
      cy.get("tr").should("have.length", 3)
      confirmFiltersAppliedContains("TRPR0107")
      removeFilterTag("TRPR0107")

      cy.get("button[id=filter-button]").click()

      inputAndSearch("reason-code", "HO200212")
      cy.contains("Case00001")
      confirmMultipleFieldsNotDisplayed(["Case00000", "Case00002"])
      cy.get("tr").should("have.length", 2)
      confirmFiltersAppliedContains("HO200212")

      removeFilterTag("HO200212")
      confirmMultipleFieldsDisplayed(["Case00000", "Case00001", "Case00002"])
    })

    it("Should let users use all search fields", () => {
      cy.task("insertCourtCasesWithFields", [
        { defendantName: "Bruce Wayne", courtName: "London Court", ptiurn: "Case00001", orgForPoliceFilter: "011111" },
        { defendantName: "Bruce Gordon", courtName: "London Court", ptiurn: "Case00002", orgForPoliceFilter: "011111" },
        {
          defendantName: "Bruce Pennyworth",
          courtName: "Manchester Court",
          ptiurn: "Case00003",
          orgForPoliceFilter: "011111"
        },
        {
          defendantName: "Alfred Pennyworth",
          courtName: "London Court",
          ptiurn: "Case00004",
          orgForPoliceFilter: "011111"
        }
      ])
      cy.task("insertException", { caseId: 0, exceptionCode: "HO200212", errorReport: "HO200212||ds:Reason" })
      cy.task("insertException", { caseId: 1, exceptionCode: "HO200213", errorReport: "HO200213||ds:Reason" })
      cy.task("insertException", { caseId: 2, exceptionCode: "HO200214", errorReport: "HO200214||ds:Reason" })

      visitBasePathAndShowFilters()

      inputAndSearch("keywords", "Bruce")
      confirmMultipleFieldsNotDisplayed(["Alfred Pennyworth"])
      cy.get("tr").should("have.length", 4)
      confirmMultipleFieldsDisplayed(["Bruce Wayne", "Bruce Gordon", "Bruce Pennyworth"])

      cy.get("button[id=filter-button]").click()
      inputAndSearch("court-name", "London Court")
      confirmMultipleFieldsNotDisplayed(["Bruce Pennyworth", "Alfred Pennyworth"])
      cy.get("tr").should("have.length", 3)
      confirmMultipleFieldsDisplayed(["Bruce Wayne", "Bruce Gordon"])

      cy.get("button[id=filter-button]").click()
      inputAndSearch("ptiurn", "Case0000")
      confirmMultipleFieldsNotDisplayed(["Bruce Pennyworth", "Alfred Pennyworth"])
      cy.get("tr").should("have.length", 3)
      confirmMultipleFieldsDisplayed(["Bruce Wayne", "Bruce Gordon"])
      removeFilterTag("Case0000")

      cy.get("button[id=filter-button]").click()
      inputAndSearch("reason-code", "HO200212")
      confirmMultipleFieldsNotDisplayed(["Bruce Gordon", "Bruce Pennyworth", "Alfred Pennyworth"])
      cy.get("tr").should("have.length", 2)
      confirmMultipleFieldsDisplayed(["Bruce Wayne"])
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

      visitBasePathAndShowFilters()

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
      cy.get("tr").not(":first").should("have.length", 8)

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
      cy.get("tr").not(":first").should("have.length", 8)

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
      cy.get("tr").not(":first").should("have.length", 8)

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
      cy.get("tr").not(":first").should("have.length", 8)

      // Tests for "This month"
      cy.get("button#filter-button").click()
      cy.get("#date-range").click()
      cy.get('label[for="date-range-this-month"]').should("have.text", expectedThisMonthLabel)
      cy.get("#date-range-this-month").click()
      cy.get("button#search").click()

      cy.get("tr").not(":first").should("have.length", 6)
      confirmMultipleFieldsDisplayed([
        todayDateString,
        yesterdayDateString,
        oneWeekAgoDateString,
        twoWeeksAgoDateString,
        oneWeekAndOneDayAgoDateString,
        oneMonthAgoDateString,
        "Case00000",
        "Case00001",
        "Case00003",
        "Case00004",
        "Case00005",
        "Case00006"
      ])

      confirmMultipleFieldsDisplayed([oneMonthAgoDateString, "Case00006"])
      cy.get("tr").not(":first").should("have.length", 6)
      cy.get("tr").not(":first").contains(todayDateString).should("exist")
      cy.get("tr").not(":first").contains(yesterdayDateString).should("exist")
      cy.get("tr").not(":first").contains(oneWeekAgoDateString).should("exist")
      cy.get("tr").not(":first").contains(twoWeeksAgoDateString).should("exist")
      cy.get("tr").not(":first").contains(oneWeekAndOneDayAgoDateString).should("exist")
      cy.get("tr").not(":first").contains(oneMonthAgoDateString).should("exist")

      cy.get("tr").not(":first").contains("Case00000").should("exist")
      cy.get("tr").not(":first").contains("Case00001").should("exist")
      cy.get("tr").not(":first").contains("Case00003").should("exist")
      cy.get("tr").not(":first").contains("Case00004").should("exist")
      cy.get("tr").not(":first").contains("Case00005").should("exist")
      cy.get("tr").not(":first").contains("Case00006").should("exist")

      removeFilterTag("This month")
      cy.get("tr").not(":first").should("have.length", 8)
    })

    it("Should display cases filtered for a custom date range", () => {
      const force = "011111"

      cy.task("insertCourtCasesWithFields", [
        { courtDate: new Date("2023-01-1"), orgForPoliceFilter: force },
        { courtDate: new Date("2023-02-1"), orgForPoliceFilter: force },
        { courtDate: new Date("2022-12-1"), orgForPoliceFilter: force },
        { courtDate: new Date("2022-11-15"), orgForPoliceFilter: force },
        { courtDate: new Date("2022-11-2"), orgForPoliceFilter: force },
        { courtDate: new Date("2022-10-30"), orgForPoliceFilter: force },
        { courtDate: new Date("2022-10-15"), orgForPoliceFilter: force },
        { courtDate: new Date("2022-10-1"), orgForPoliceFilter: force },
        { courtDate: new Date("2022-09-15"), orgForPoliceFilter: force },
        { courtDate: new Date("2021-12-15"), orgForPoliceFilter: force },
        { courtDate: new Date("2021-02-10"), orgForPoliceFilter: force },
        { courtDate: new Date("2020-05-30"), orgForPoliceFilter: force },
        { courtDate: new Date("2019-05-10"), orgForPoliceFilter: force }
      ])

      cy.visit("/bichard")

      cy.get("button#filter-button").click()
      cy.get("#custom-date-range").click()
      cy.get("#date-from").type("2022-01-01")
      cy.get("#date-to").type("2022-12-31")
      cy.get(".govuk-heading-s").contains("Custom date range").should("exist")
      cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")
      cy.get("button#search").click()

      cy.get("button#filter-button").click()
      cy.get("#date-range").click().should("be.checked")
      cy.get("#date-from").should("have.value", "2022-01-01")
      cy.get("#date-to").should("have.value", "2022-12-31")

      cy.get("tr").not(":first").should("have.length", 7)

      cy.contains("Hide filter").click()

      confirmFiltersAppliedContains("01/01/2022 - 31/12/2022")
      removeFilterTag("01/01/2022 - 31/12/2022")
      cy.get("tr").not(":first").should("have.length", 13)
    })

    it.skip("Should ensure radio buttons are correctly selected for 'date range' and 'custom date range' filters", () => {
      // TODO- BICAWS-2616 filter panel bug with court date radio buttons.
      cy.visit("/bichard")
      cy.get("button#filter-button").click()

      cy.get("#date-range").click().should("be.checked")

      cy.get("#date-range-yesterday").click().should("be.checked")

      cy.get("#date-range").should("be.checked")
      cy.get("#date-range-yesterday").should("be.checked")
      cy.get("#custom-date-range").should("not.be.checked")

      cy.get("#custom-date-range").click().should("be.checked")
      cy.get("#date-range").should("not.be.checked")

      cy.get("#date-range-yesterday").should("not.be.checked")
      cy.get(".moj-filter__tag").contains("Yesterday").should("not.exist")
    })

    it("Should update 'selected filter' chip when changing custom date range filter", () => {
      cy.visit("/bichard")
      cy.get("button#filter-button").click()
      cy.get("#custom-date-range").click()

      cy.get("#date-from").type("1999-01-01")
      cy.get("#date-to").type("2000-12-31")
      cy.get(".govuk-heading-s").contains("Custom date range").should("exist")
      cy.get(".moj-filter__tag").contains("01/01/1999 - 31/12/2000")

      cy.get("#date-from").type("2022-01-01")
      cy.get("#date-to").type("2022-12-31")
      cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")
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

    it("Should filter cases that has Bails", () => {
      cy.task("insertCourtCasesWithFields", [
        { orgForPoliceFilter: "011111" },
        { orgForPoliceFilter: "011111" },
        { orgForPoliceFilter: "011111" }
      ])
      const conditionalBailCode = "TRPR0010"
      const conditionalBailTrigger: TestTrigger = {
        triggerId: 0,
        triggerCode: conditionalBailCode,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
      cy.task("insertTriggers", { caseId: 0, triggers: [conditionalBailTrigger] })
      cy.task("insertException", { caseId: 1, exceptionCode: "HO100206" })
      cy.task("insertException", { caseId: 2, exceptionCode: "HO100206" })

      cy.visit("/bichard")

      confirmMultipleFieldsDisplayed(["Case00000", "Case00001", "Case00002"])

      cy.get("button[id=filter-button]").click()
      cy.get('[id="bails-type"]').check()
      cy.get("button[id=search]").click()

      cy.get('*[class^="moj-filter-tags"]').contains("Bails")

      confirmMultipleFieldsDisplayed(["Case00000"])
      confirmMultipleFieldsNotDisplayed(["Case00001", "Case00002"])

      removeFilterTag("Bails")
      confirmMultipleFieldsDisplayed(["Case00000", "Case00001", "Case00002"])
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

      visitBasePathAndShowFilters()
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

      visitBasePathAndShowFilters()

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

      visitBasePathAndShowFilters()
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
      visitBasePathAndShowFilters()
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
      it("Should filter cases that I hold the trigger lock for", () => {
        cy.task("insertCourtCasesWithFields", [
          { errorLockedByUsername: "Bichard01", triggerLockedByUsername: "Bichard01", orgForPoliceFilter: "011111" },
          { orgForPoliceFilter: "011111" },
          { errorLockedByUsername: "Bichard02", triggerLockedByUsername: "Bichard02", orgForPoliceFilter: "011111" },
          { orgForPoliceFilter: "011111" }
        ])

        visitBasePathAndShowFilters()

        cy.get("#my-cases-filter").click()
        cy.contains("Selected filters")
        cy.contains("My cases")

        cy.get("#search").click()

        cy.contains("Case00000")
        cy.contains("Bichard01")
        confirmMultipleFieldsNotDisplayed(["Case00001", "Case00002", "Case00003"])
      })
    })

    describe("Applied filter section", () => {
      it("Should show the applied filter section when the filter panel is hidden", () => {
        visitBasePathAndShowFilters()
        inputAndSearch("keywords", "Bruce Wayne")

        cy.contains("Show filter")
        cy.contains("Hide filter").should("not.exist")
        cy.contains("Filters applied")
        cy.contains("Clear filters")
      })
      it("Should hide the applied filter section when the filter panel is shown", () => {
        visitBasePathAndShowFilters()
        inputAndSearch("keywords", "Bruce Wayne")

        cy.contains("Show filter")
        cy.contains("Show filter").click()
        cy.contains("Show filter").should("not.exist")
        cy.contains("Hide filter")
        cy.contains("Filters applied").should("not.exist")
        cy.contains("Clear filters").should("not.exist")
        cy.contains("Applied filters")
      })
    })
  })
})

export {}
