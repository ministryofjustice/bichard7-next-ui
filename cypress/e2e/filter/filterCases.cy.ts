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

    it("Should expand and collapse case state filter navigation", () => {
      cy.visit("/bichard")
      cy.get("button[id=filter-button]").click()

      cy.contains("Unresolved & resolved cases").should("exist")

      cy.contains("Case state").parent().parent().parent().find("button").click()
      cy.contains("Unresolved & resolved cases").should("not.exist")

      cy.contains("Case state").parent().parent().parent().find("button").click()
      cy.contains("Unresolved & resolved cases").should("exist")
    })

    it("Should display cases filtered by defendant name", () => {
      cy.task("insertCourtCasesWithFields", [
        { defendantName: "Bruce Wayne", orgForPoliceFilter: "011111" },
        { defendantName: "Barbara Gordon", orgForPoliceFilter: "011111" },
        { defendantName: "Alfred Pennyworth", orgForPoliceFilter: "011111" }
      ])

      cy.visit("/bichard")

      cy.get("button[id=filter-button]").click()
      cy.get("input[id=keywords]").type("Bruce Wayne")

      cy.get("button[id=search]").click()
      cy.get("tr").not(":first").get("td:nth-child(2)").contains("Bruce Wayne")
      cy.get("tr").not(":first").get("td:nth-child(2)").contains("Barbara Gordon").should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(2)").contains("Alfred Pennyworth").should("not.exist")
      cy.get("tr").should("have.length", 2)
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Bruce Wayne")

      // Removing filter tag
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Bruce Wayne").click({ force: true })
      cy.get("tr").not(":first").get("td:nth-child(2)").contains("Bruce Wayne")
      cy.get("tr").not(":first").get("td:nth-child(2)").contains("Barbara Gordon")
      cy.get("tr").not(":first").get("td:nth-child(2)").contains("Alfred Pennyworth")
    })

    it("Should display cases filtered by court name", () => {
      cy.task("insertCourtCasesWithFields", [
        { courtName: "Manchester Court", orgForPoliceFilter: "011111" },
        { courtName: "London Court", orgForPoliceFilter: "011111" },
        { courtName: "Bristol Court", orgForPoliceFilter: "011111" }
      ])

      cy.visit("/bichard")

      cy.get("button[id=filter-button]").click()
      cy.get("input[id=court-name]").type("Manchester Court")

      cy.get("button[id=search]").click()
      cy.get("tr").not(":first").get("td:nth-child(4)").contains("Manchester Court")
      cy.get("tr").not(":first").get("td:nth-child(4)").contains("London Court").should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(4)").contains("Bristol Court").should("not.exist")
      cy.get("tr").should("have.length", 2)
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Manchester Court")

      // Removing filter tag
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Manchester Court").click({ force: true })
      cy.get("tr").not(":first").get("td:nth-child(4)").contains("Manchester Court")
      cy.get("tr").not(":first").get("td:nth-child(4)").contains("London Court")
      cy.get("tr").not(":first").get("td:nth-child(4)").contains("Bristol Court")
    })

    it("Should display cases filtered by PTIURN", () => {
      cy.task("insertCourtCasesWithFields", [
        { ptiurn: "Case00001", orgForPoliceFilter: "011111" },
        { ptiurn: "Case00002", orgForPoliceFilter: "011111" },
        { ptiurn: "Case00003", orgForPoliceFilter: "011111" }
      ])

      cy.visit("/bichard")

      cy.get("button[id=filter-button]").click()
      cy.get("input[id=ptiurn]").type("Case00001")

      cy.get("button[id=search]").click()
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00001")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00002").should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00003").should("not.exist")
      cy.get("tr").should("have.length", 2)
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Case00001")

      // Removing filter tag
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Case00001").click({ force: true })
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00001")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00002")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00003")
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

      cy.visit("/bichard")

      cy.get("button[id=filter-button]").click()
      cy.get("input[id=reason-search]").type("TRPR0107")

      cy.get("button[id=search]").click()
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00000")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00001").should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00002").should("not.exist")
      cy.get("tr").should("have.length", 2)
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("TRPR0107")
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("TRPR0107").click({ force: true })

      cy.get("button[id=filter-button]").click()
      cy.get("input[id=reason-search]").type("HO200212")

      cy.get("button[id=search]").click()
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00001")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00000").should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00002").should("not.exist")
      cy.get("tr").should("have.length", 2)
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("HO200212")

      // Removing filter tag
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("HO200212").click({ force: true })
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00000")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00001")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00002")
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

      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Today").click({ force: true })
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

      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Yesterday").click({ force: true })
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

      cy.get(".moj-filter-tags a.moj-filter__tag").contains("This week").click({ force: true })
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

      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Last week").click({ force: true })
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

      cy.get(".moj-filter-tags a.moj-filter__tag").contains("This month").click({ force: true })
      cy.get("tr").not(":first").should("have.length", 5)
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

      // Tests for all cases in 2022
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

      cy.get("tr").not(":first").should("have.length", 5)
      cy.findByText("Next page").should("exist")
      cy.findByText("Next page").click()
      cy.get("tr").not(":first").should("have.length", 2)

      cy.get(".moj-filter-tags a.moj-filter__tag").contains("01/01/2022 - 31/12/2022").should("exist")
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("01/01/2022 - 31/12/2022").click({ force: true })
      cy.get("tr").not(":first").should("have.length", 5)
      cy.findByText("Next page").click()
      cy.get("tr").not(":first").should("have.length", 5)
      cy.findByText("Next page").click()
      cy.get("tr").not(":first").should("have.length", 3)
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
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00001`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00002`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00003`)

      // Filtering by having triggers
      cy.get("button[id=filter-button]").click()
      cy.get('[id="triggers-type"]').check()
      cy.get("button[id=search]").click()

      cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00001`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00002`).should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00003`).should("not.exist")

      // Filtering by having exceptions
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Triggers").click({ force: true })
      cy.get("button[id=filter-button]").click()
      cy.get('[id="exceptions-type"]').check()
      cy.get("button[id=search]").click()

      cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")

      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00001`).should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00002`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00003`).should("not.exist")

      // Filter for both triggers and exceptions
      cy.get("button[id=filter-button]").click()
      cy.get('[id="triggers-type"]').check()
      cy.get('[id="exceptions-type"]').check()
      cy.get("button[id=search]").click()

      cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")
      cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00001`)

      // Removing exceptions filter tag
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Exceptions").click({ force: true })

      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00001`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00002`).should("not.exist")
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00003`).should("not.exist")

      // Removing triggers filter tag
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Triggers").click({ force: true })

      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00000`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00001`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00002`)
      cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00003`)
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
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Urgent").click({ force: true })
      cy.get("tr").not(":first").should("have.length", 4)

      // Filter for non-urgent cases
      cy.get("button[id=filter-button]").click()
      cy.get("#non-urgent").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 1)
      cy.get("tr").contains("Case00001").should("exist")

      // Removing non-urgent filter tag all case should be shown with the filter disabled
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Non-urgent").click({ force: true })
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

      cy.visit("/bichard")

      // Filter for resolved and unresolved cases
      cy.get("button[id=filter-button]").click()
      cy.get("#unresolved-and-resolved").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 4)
      cy.get("tr").not(":first").contains("Case00000").should("exist")

      // Removing case state filter tag unresolved cases should be shown with the filter disabled
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Unresolved & resolved cases").click({ force: true })
      cy.get("tr").not(":first").should("have.length", 1)

      // Filter for resolved cases
      cy.get("button[id=filter-button]").click()
      cy.get("#resolved").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 3)
      cy.get("tr").contains("Case00001").should("exist")

      // Removing case state filter tag unresolved cases should be shown with the filter disabled
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Resolved cases").click({ force: true })
      cy.get("tr").not(":first").should("have.length", 1)
    })

    it("Should filter cases by locked state", () => {
      cy.task("insertCourtCasesWithFields", [
        { errorLockedByUsername: "Bichard01", triggerLockedByUsername: "Bichard01", orgForPoliceFilter: "011111" },
        { orgForPoliceFilter: "011111" }
      ])

      cy.visit("/bichard")

      // Filter for locked cases
      cy.get("button[id=filter-button]").click()
      cy.get("#locked").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 1)
      cy.get("tr").not(":first").contains("Case00000").should("exist")

      // Removing locked filter tag all case should be shown with the filter disabled
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Locked").click({ force: true })
      cy.get("tr").not(":first").should("have.length", 2)

      // Filter for unlocked cases
      cy.get("button[id=filter-button]").click()
      cy.get("#unlocked").click()
      cy.get("button[id=search]").click()

      cy.get("tr").not(":first").should("have.length", 1)
      cy.get("tr").contains("Case00001").should("exist")

      // Removing unlocked filter tag all case should be shown with the filter disabled
      cy.get(".moj-filter-tags a.moj-filter__tag").contains("Unlocked").click({ force: true })
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
