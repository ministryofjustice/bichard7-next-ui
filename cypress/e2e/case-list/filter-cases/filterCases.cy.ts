import { addDays, format, subDays } from "date-fns"
import { BailCodes } from "../../../../src/utils/bailCodes"
import { TestTrigger } from "../../../../test/utils/manageTriggers"
import hashedPassword from "../../../fixtures/hashedPassword"
import a11yConfig from "../../../support/a11yConfig"
import {
  confirmFiltersAppliedContains,
  confirmMultipleFieldsDisplayed,
  confirmMultipleFieldsNotDisplayed,
  exactMatch,
  filterByCaseAge
} from "../../../support/helpers"
import logAccessibilityViolations from "../../../support/logAccessibilityViolations"

function visitBasePathAndShowFilters() {
  cy.visit("/bichard")
  cy.get("button[id=filter-button]").click()
}

function collapseFilterSection(sectionToBeCollapsed: string, optionToBeCollapsed: string) {
  cy.contains(exactMatch(sectionToBeCollapsed), { matchCase: true }).parent().parent().parent().find("button").click()
  cy.get(optionToBeCollapsed).should("not.be.visible")
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

describe("Filtering cases", () => {
  before(() => {
    cy.task("clearUsers")
    cy.task("insertUsers", {
      users: [
        {
          username: "Bichard01",
          visibleForces: ["0011111"],
          forenames: "Bichard Test User",
          surname: "01",
          email: "bichard01@example.com",
          password: hashedPassword
        }
      ],
      userGroups: ["B7NewUI_grp", "B7GeneralHandler_grp"]
    })
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.login("bichard01@example.com", "password")
  })

  it("Should be accessible with conditional radio buttons opened", () => {
    visitBasePathAndShowFilters()
    cy.contains("Court date").parent().parent().parent().find("button").click()
    cy.get("#case-age").should("not.be.visible")
    expandFilterSection("Court date", "#case-age")

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("Should be accessible", () => {
    visitBasePathAndShowFilters()
    cy.get("input[id=keywords]").type("Dummy")
    cy.get(`label[for="triggers-type"]`).click()
    cy.get(`label[for="exceptions-type"]`).click()

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

  it("Should expand and collapse reason filter navigation & show the trigger info", () => {
    visitBasePathAndShowFilters()

    cy.contains("Exceptions")

    collapseFilterSection("Reason", "#exceptions-type")
    expandFilterSection("Reason", "#exceptions-type")

    cy.get("#warningIcon").click()
    cy.contains("Included triggers")
    Object.entries(BailCodes).map(([bailCode, bailName]) => cy.contains(`${bailCode} - ${bailName}`))
  })

  it("Should expand and collapse court date filter navigation with the ratio conditional sections collapsed after the second expand", () => {
    visitBasePathAndShowFilters()

    cy.contains("Date range")

    cy.contains("Court date").parent().parent().parent().find("button").click()
    cy.get("#case-age").should("not.be.visible")
    expandFilterSection("Court date", "#case-age")

    // Date range & case ages are collapsed
    cy.get(`label[for="date-from"]`).should("not.be.visible")
    cy.get(`label[for="case-age-yesterday"]`).should("not.be.visible")
    // Opening date range collapses case age & opens date range
    cy.get(`label[for="date-range"]`).click()
    cy.get(`label[for="date-from"]`).should("be.visible")
    cy.get(`label[for="case-age-yesterday"]`).should("not.be.visible")
  })

  it("Should remove the selection of the case age when it's been changed to the date range", () => {
    visitBasePathAndShowFilters()
    filterByCaseAge(`label[for="case-age-yesterday"]`)
    cy.get("#case-age-yesterday").should("be.checked")
    cy.get(`label[for="date-range"]`).click()
    cy.get(`label[for="case-age"]`).click()
    cy.get("#case-age-yesterday").should("not.be.checked")
  })

  it("Should remove the selection of the date range when it's been changed to the case age", () => {
    visitBasePathAndShowFilters()
    cy.get("label[for=date-range]").click()
    cy.get("label[for=date-from]").type("2022-01-01")
    cy.get("label[for=date-to]").type("2022-12-31")
    cy.get("#date-range").should("be.checked")
    filterByCaseAge(`label[for="case-age-yesterday"]`)
    cy.get("#case-age").should("be.checked")
    cy.get("#case-age-yesterday").should("be.checked")
  })

  it("Should only have the checked attribute for the selected case age ratio button", () => {
    visitBasePathAndShowFilters()
    // no selection, nothing is checked
    cy.get("#case-age").should("not.be.checked")
    cy.get("#date-range").should("not.be.checked")
    // #case-age-yesterday selected, #case-age is checked
    filterByCaseAge(`label[for="case-age-yesterday"]`)
    cy.get("#case-age").should("be.checked")
    cy.get("#date-range").should("not.be.checked")
    // #date-range, ##date-range is checked
    cy.get(`label[for="date-range"]`).click()
    cy.get("#case-age").should("not.be.checked")
    cy.get("#date-range").should("be.checked")
  })

  it("Should expand and collapse locked state filter navigation", () => {
    visitBasePathAndShowFilters()

    cy.contains("Locked cases only")

    collapseFilterSection("Locked state", "#locked")
    expandFilterSection("Locked state", "#locked")
  })

  it("Should display cases filtered by defendant name", () => {
    cy.task("insertCourtCasesWithFields", [
      { defendantName: "WAYNE Bruce", orgForPoliceFilter: "011111" },
      { defendantName: "GORDON Barbara", orgForPoliceFilter: "011111" },
      { defendantName: "PENNYWORTH Alfred", orgForPoliceFilter: "011111" }
    ])

    visitBasePathAndShowFilters()

    inputAndSearch("keywords", "WAYNE Bruce")
    cy.contains("WAYNE Bruce")
    confirmMultipleFieldsNotDisplayed(["GORDON Barbara", "PENNYWORTH Alfred"])
    cy.get("tr").should("have.length", 2)
    confirmFiltersAppliedContains("WAYNE Bruce")

    removeFilterTag("WAYNE Bruce")
    confirmMultipleFieldsDisplayed(["WAYNE Bruce", "GORDON Barbara", "PENNYWORTH Alfred"])
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
    cy.get("tbody tr").should("have.length", 1)
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
      { defendantName: "WAYNE Bruce", courtName: "London Court", ptiurn: "Case00001", orgForPoliceFilter: "011111" },
      { defendantName: "GORDON Bruce", courtName: "London Court", ptiurn: "Case00002", orgForPoliceFilter: "011111" },
      {
        defendantName: "PENNYWORTH Bruce",
        courtName: "Manchester Court",
        ptiurn: "Case00003",
        orgForPoliceFilter: "011111"
      },
      {
        defendantName: "PENNYWORTH Alfred",
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
    confirmMultipleFieldsNotDisplayed(["PENNYWORTH Alfred"])
    cy.get("tr").should("have.length", 4)
    confirmMultipleFieldsDisplayed(["WAYNE Bruce", "GORDON Bruce", "PENNYWORTH Bruce"])

    cy.get("button[id=filter-button]").click()
    inputAndSearch("court-name", "London Court")
    confirmMultipleFieldsNotDisplayed(["PENNYWORTH Bruce", "PENNYWORTH Alfred"])
    cy.get("tr").should("have.length", 3)
    confirmMultipleFieldsDisplayed(["WAYNE Bruce", "GORDON Bruce"])

    cy.get("button[id=filter-button]").click()
    inputAndSearch("ptiurn", "Case0000")
    confirmMultipleFieldsNotDisplayed(["PENNYWORTH Bruce", "PENNYWORTH Alfred"])
    cy.get("tr").should("have.length", 3)
    confirmMultipleFieldsDisplayed(["WAYNE Bruce", "GORDON Bruce"])
    removeFilterTag("Case0000")

    cy.get("button[id=filter-button]").click()
    inputAndSearch("reason-code", "HO200212")
    confirmMultipleFieldsNotDisplayed(["GORDON Bruce", "PENNYWORTH Bruce", "PENNYWORTH Alfred"])
    cy.get("tr").should("have.length", 2)
    confirmMultipleFieldsDisplayed(["WAYNE Bruce"])
  })

  it("Should display cases filtered for an SLA date", () => {
    const force = "011111"

    const todayDate = new Date()
    const yesterdayDate = subDays(todayDate, 1)
    const day2Date = subDays(todayDate, 2)
    const day3Date = subDays(todayDate, 3)
    const aLongTimeAgoDate = new Date("2001-09-26")

    const dateFormatString = "dd/MM/yyyy"
    const day2DateString = format(day2Date, dateFormatString)
    const day3DateString = format(day3Date, dateFormatString)
    const day15DateString = format(subDays(todayDate, 15), dateFormatString)

    cy.task("insertCourtCasesWithFields", [
      { courtDate: todayDate, orgForPoliceFilter: force },
      { courtDate: yesterdayDate, orgForPoliceFilter: force },
      { courtDate: yesterdayDate, orgForPoliceFilter: force },
      { courtDate: day2Date, orgForPoliceFilter: force },
      { courtDate: day3Date, orgForPoliceFilter: force },
      { courtDate: day3Date, orgForPoliceFilter: force },
      { courtDate: day3Date, orgForPoliceFilter: force },
      { courtDate: aLongTimeAgoDate, orgForPoliceFilter: force }
    ])

    visitBasePathAndShowFilters()

    // Tests for "Today"
    filterByCaseAge(`label[for="case-age-today"]`)
    cy.get('label[for="case-age-today"]').should("have.text", "Today (1)")
    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    cy.get("tr")
      .not(":first")
      .each((row) => {
        cy.wrap(row).contains("Case00000").should("exist")
      })

    removeFilterTag("Today")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)

    // Tests for "yesterday"
    cy.get("button#filter-button").click()
    filterByCaseAge(`label[for="case-age-yesterday"]`)
    cy.get('label[for="case-age-yesterday"]').should("have.text", "Yesterday (2)")
    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 2)
    confirmMultipleFieldsDisplayed(["Case00001", "Case00002"])
    confirmMultipleFieldsNotDisplayed(["Case00000", "Case00003", "Case00004", "Case00005", "Case00006", "Case00007"])

    removeFilterTag("Yesterday")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)

    // Tests for "Day 2"
    cy.get("button#filter-button").click()
    cy.get('label[for="case-age-day-2"]').should("have.text", `Day 2 (${day2DateString}) (1)`)
    filterByCaseAge(`label[for="case-age-day-2"]`)
    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    cy.get("tr")
      .not(":first")
      .each((row) => {
        cy.wrap(row).contains("Case00003").should("exist")
      })

    removeFilterTag("Day 2")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)

    // Tests for "Day 3"
    cy.get("button#filter-button").click()
    cy.get('label[for="case-age-day-3"]').should("have.text", `Day 3 (${day3DateString}) (3)`)
    filterByCaseAge(`label[for="case-age-day-3"]`)
    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 3)
    confirmMultipleFieldsDisplayed(["Case00004", "Case00005", "Case00006"])
    confirmMultipleFieldsNotDisplayed(["Case00000", "Case00001", "Case00002", "Case00003", "Case00007"])

    removeFilterTag("Day 3")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)

    // Tests for "Day 15 and older"
    cy.get("button#filter-button").click()
    cy.get('label[for="case-age-day-15-and-older"]').should(
      "have.text",
      `Day 15 and older (up to ${day15DateString}) (1)`
    )
    filterByCaseAge(`label[for="case-age-day-15-and-older"]`)
    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    confirmMultipleFieldsDisplayed(["Case00007"])
    confirmMultipleFieldsNotDisplayed([
      "Case00000",
      "Case00001",
      "Case00002",
      "Case00003",
      "Case00004",
      "Case00005",
      "Case00006"
    ])

    removeFilterTag("Day 15 and older")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)

    // Test for multiple SLA
    cy.get("button#filter-button").click()
    filterByCaseAge(`label[for="case-age-today"]`)
    filterByCaseAge(`label[for="case-age-day-3"]`)
    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 4)
    confirmMultipleFieldsDisplayed(["Case00000", "Case00004", "Case00005", "Case00006"])
    confirmMultipleFieldsNotDisplayed(["Case00001", "Case00002", "Case00003", "Case00007"])

    removeFilterTag("Day 3")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    removeFilterTag("Today")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)
  })

  it("Should display cases filtered for a date range", () => {
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
    cy.get(`label[for="date-range"]`).click()
    cy.get(`label[for="date-from"]`).type("2022-01-01")
    cy.get(`label[for="date-to"]`).type("2022-12-31")
    cy.get(".govuk-heading-s").contains("Date range").should("exist")
    cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")
    cy.get("button#search").click()

    cy.get("button#filter-button").click()
    cy.get(`label[for="date-range"]`).click()
    cy.get("#date-range").should("be.checked")
    cy.get("#date-from").should("have.value", "2022-01-01")
    cy.get("#date-to").should("have.value", "2022-12-31")

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 7)

    cy.contains("Hide search panel").click()

    confirmFiltersAppliedContains("01/01/2022 - 31/12/2022")
    removeFilterTag("01/01/2022 - 31/12/2022")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 13)
  })

  it("Should update 'selected filter' chip when changing date range filter", () => {
    cy.visit("/bichard")
    cy.get("button#filter-button").click()
    cy.get(`label[for="date-range"]`).click()

    cy.get(`label[for="date-from"]`).type("1999-01-01")
    cy.get(`label[for="date-to"]`).type("2000-12-31")
    cy.get(".govuk-heading-s").contains("Date range").should("exist")
    cy.get(".moj-filter__tag").contains("01/01/1999 - 31/12/2000")

    cy.get(`label[for="date-from"]`).type("2022-01-01")
    cy.get(`label[for="date-to"]`).type("2022-12-31")
    cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")
  })

  it("Should not allow passing an invalid case age filter", () => {
    const force = "011111"
    cy.task("insertCourtCasesWithFields", [
      { courtDate: new Date(), orgForPoliceFilter: force },
      { courtDate: subDays(new Date(), 1), orgForPoliceFilter: force },
      { courtDate: addDays(new Date(), 1), orgForPoliceFilter: force }
    ])

    cy.visit("/bichard?caseAge=invalid")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 3)
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
    cy.get(`label[for="triggers-type"]`).click()
    cy.get("button[id=search]").click()

    cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

    confirmMultipleFieldsDisplayed([`Case00000`, `Case00001`])
    confirmMultipleFieldsNotDisplayed(["Case00002", "Case00003"])

    // Filtering by having exceptions
    removeFilterTag("Triggers")
    cy.get("button[id=filter-button]").click()
    cy.get(`label[for="exceptions-type"]`).click()
    cy.get("button[id=search]").click()

    cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")

    confirmMultipleFieldsDisplayed([`Case00000`, `Case00002`])
    confirmMultipleFieldsNotDisplayed([`Case00001`, `Case00003`])

    removeFilterTag("Exceptions")

    // Filter for both triggers and exceptions
    cy.get("button[id=filter-button]").click()
    cy.get(`label[for="triggers-type"]`).click()
    cy.get(`label[for="exceptions-type"]`).click()
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
    cy.get(`label[for="bails-type"]`).click()
    cy.get("button[id=search]").click()

    cy.get('*[class^="moj-filter-tags"]').contains("Bails")

    confirmMultipleFieldsDisplayed(["Case00000"])
    confirmMultipleFieldsNotDisplayed(["Case00001", "Case00002"])

    removeFilterTag("Bails")
    confirmMultipleFieldsDisplayed(["Case00000", "Case00001", "Case00002"])
  })

  it("Should filter cases by case state", () => {
    const resolutionTimestamp = new Date()
    const force = "011111"
    cy.task("insertCourtCasesWithFields", [
      { resolutionTimestamp: null, orgForPoliceFilter: force },
      { resolutionTimestamp: resolutionTimestamp, orgForPoliceFilter: force, errorResolvedBy: "Bichard01" },
      { resolutionTimestamp: resolutionTimestamp, orgForPoliceFilter: force, errorResolvedBy: "Bichard01" },
      { resolutionTimestamp: resolutionTimestamp, orgForPoliceFilter: force, errorResolvedBy: "Bichard01" }
    ])

    visitBasePathAndShowFilters()

    // Filter for unresolved cases by default
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)

    // Filter for resolved cases
    cy.get(`label[for="resolved"]`).click()
    cy.get("button[id=search]").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 3)
    cy.contains("Case00001")

    // Removing case state filter tag unresolved cases should be shown with the filter disabled
    removeFilterTag("Resolved cases")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
  })

  it("Should filter cases by locked state", () => {
    cy.task("insertCourtCasesWithFields", [
      { errorLockedByUsername: "Bichard01", triggerLockedByUsername: "Bichard01", orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" }
    ])

    visitBasePathAndShowFilters()
    // Filter for locked cases
    cy.get(`label[for="locked"]`).click()
    cy.get("button[id=search]").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    cy.contains("Case00000")

    // Removing locked filter tag all case should be shown with the filter disabled
    removeFilterTag("Locked")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 2)

    // Filter for unlocked cases
    cy.get("button[id=filter-button]").click()
    cy.get(`label[for="unlocked"]`).click()
    cy.get("button[id=search]").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    cy.contains("Case00001")

    // Removing unlocked filter tag all case should be shown with the filter disabled
    removeFilterTag("Unlocked")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 2)
  })

  it("Should clear filters when clicked on the link outside of the filter panel", () => {
    visitBasePathAndShowFilters()
    cy.get("input[id=keywords]").type("Dummy")
    cy.get('label[for="triggers-type"]').click()
    cy.get('label[for="exceptions-type"]').click()
    cy.get("button[id=search]").click()

    cy.get('*[class^="moj-filter-tags"]').contains("Dummy")
    cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")
    cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

    cy.get(".moj-filter-tags a").contains("Clear filters").click()

    cy.get('*[class^="moj-filter-tags"]').should("not.exist")
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/bichard")
    })
  })

  it("Should clear filters when clicked on the link inside the filter panel", () => {
    visitBasePathAndShowFilters()
    cy.get("input[id=keywords]").type("Dummy")
    cy.get('label[for="triggers-type"]').click()
    cy.get('label[for="exceptions-type"]').click()
    cy.get("button[id=search]").click()

    cy.get('*[class^="moj-filter-tags"]').contains("Dummy")
    cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")
    cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

    cy.get("button[id=filter-button]").click()

    cy.get(".moj-filter__heading-title a").contains("Clear filters").click()

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

      cy.get(`label[for="my-cases-filter"]`).click()
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
      inputAndSearch("keywords", "WAYNE Bruce")

      cy.contains("Show search panel")
      cy.contains("Hide search panel").should("not.exist")
      cy.get(".moj-filter-tags").contains("Filters applied")
      cy.get(".moj-filter-tags").contains("Clear filters")
    })

    it("Should hide the applied filter section when the filter panel is shown", () => {
      visitBasePathAndShowFilters()
      inputAndSearch("keywords", "WAYNE Bruce")

      cy.contains("Show search panel")
      cy.contains("Show search panel").click()
      cy.contains("Show search panel").should("not.exist")
      cy.contains("Hide search panel")
      cy.contains("Filters applied").should("not.exist")
      cy.get(".moj-filter-tags").contains("Clear filters").should("not.exist")
      cy.contains("Applied filters")
    })
  })
})

export {}
