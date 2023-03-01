import hashedPassword from "../../fixtures/hashedPassword"
import { confirmFiltersAppliedContains } from "../../support/helpers"

export function removeFilterChip() {
  cy.get("li button.moj-filter__tag").trigger("click")
  cy.get(".moj-filter__tag").should("not.exist")
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
      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard")
    })

    it("Should display no filters chips and a placeholder message as the default state", () => {
      cy.get("#filter-button").click()
      cy.get(".moj-filter__tag").should("not.exist")
      cy.get(".govuk-checkboxes__item").should("not.be.checked")
      cy.get(".govuk-radios__input").should("not.be.checked")

      cy.get(".moj-filter__selected").should("exist").should("contain.text", "No filters selected")
    })

    describe("Reason", () => {
      it("Should display the Trigger filter chip when selected", () => {
        cy.get("#filter-button").click()
        cy.get(".govuk-checkboxes__item").contains("Triggers").click()

        // Check if the correct heading and filter label are applied
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-filter__tag").contains("Exceptions").should("not.exist")
      })

      it("Should remove the Trigger filter chip when the chip is clicked and remove the selected option in the filter panel", () => {
        cy.get("#filter-button").click()
        cy.get(".govuk-checkboxes__item").contains("Triggers").click()

        // Check if the correct heading and filter label are applied
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-filter__tag").contains("Exceptions").should("not.exist")

        removeFilterChip()
      })

      it("Should display Trigger and Exception filter chips when selected", () => {
        // Shows filters and clicks both options
        cy.get("#filter-button").click()
        cy.get(".govuk-checkboxes__item").contains("Triggers").click()
        cy.get(".govuk-checkboxes__item").contains("Exception").click()

        // Check if the correct heading for chips and filter labels are applied
        cy.get("h3.govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Trigger").should("exist")
        cy.get(".moj-filter__tag").contains("Exception").should("exist")
      })

      it("Should remove the Trigger and Exception filter chips when both chips are clicked and remove the selected option in the filter panel", () => {
        // Shows filters and clicks both options
        cy.get("#filter-button").click()
        cy.get(".govuk-checkboxes__item").contains("Triggers").click()
        cy.get(".govuk-checkboxes__item").contains("Exception").click()

        // Check if the correct heading for chips and filter labels are applied
        cy.get("h3.govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-filter__tag").contains("Exception").should("exist")
        cy.get(".moj-filter-tags").children().should("have.length", 2)

        // Removes the two filter chips
        cy.get("li button.moj-filter__tag").contains("Triggers").trigger("click")
        cy.get("li button.moj-filter__tag").contains("Exception").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("Date range", () => {
      it("Should allow you to add 'today' as the date range filter chip", () => {
        // Shows filters and clicks date range followed by today's date
        cy.get("#filter-button").click()
        cy.get("#date-range").click()
        cy.get("#date-range-today").click()

        // Shows the correct heading 'Today' and checks that the others are not visible
        cy.get(".govuk-heading-s").contains("Date range").should("exist")
        cy.get(".moj-filter__tag").contains("Today").should("exist")
        cy.get(".moj-filter__tag").contains("Yesterday").should("not.exist")
        cy.get(".moj-filter__tag").contains("This week").should("not.exist")
        cy.get(".moj-filter__tag").contains("Last week").should("not.exist")
        cy.get(".moj-filter__tag").contains("This month").should("not.exist")
      })

      it.only("Should remove the date range filter chip when custom date range is selected", () => {
        cy.get("#filter-button").click()
        cy.get("#date-range").click()
        cy.get("#date-range-today").click()

        cy.get("#custom-date-range").click()
        cy.get("#date-from").click().type("2022-01-01")
        cy.get("#date-to").click().type("2022-12-31")

        cy.get(".govuk-heading-s").contains("Date range").should("not.exist")
        cy.get(".moj-filter__tag").contains("Today").should("not.exist")
        cy.get(".govuk-heading-s").contains("Custom date range").should("exist")
        cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022").should("exist")
      })
    })

    describe("Custom Date range", () => {
      it("Should allow you to add custom date range filter chip", () => {
        cy.get("button#filter-button").click()
        cy.get("#custom-date-range").click()
        cy.get("#date-from").click().type("2022-01-01")
        cy.get("#date-to").click().type("2022-12-31")
        cy.get(".govuk-heading-m").contains("Selected filters").should("exist")
        cy.get(".govuk-heading-s").contains("Custom date range").should("exist")
        cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")
        cy.get("button#search").click()

        cy.get(".govuk-heading-m").contains("Applied filters").should("exist")
        confirmFiltersAppliedContains("01/01/2022 - 31/12/2022")
      })

      it.only("Should remove custom date range filter chip when custom date filter is selected", () => {
        cy.get("button#filter-button").click()
        cy.get("#custom-date-range").click()
        cy.get("#date-from").click().type("2022-01-01")
        cy.get("#date-to").click().type("2022-12-31")
        cy.get(".govuk-heading-m").contains("Selected filters").should("exist")
        cy.get(".govuk-heading-s").contains("Custom date range").should("exist")
        cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")

        cy.get("#date-range").click()
        cy.get("#date-range-today").click()

        cy.get(".govuk-heading-s").contains("Custom date range").should("not.exist")
        cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022").should("not.exist")
        cy.get(".govuk-heading-s").contains("Date range").should("exist")
        cy.get(".moj-filter__tag").contains("Today").should("exist")
      })

      it.skip("Should apply the 'Custom date filter' filter chips then remove this chips to the original state", () => {
        // TODO: fix during the state refactor - 2616 (filter panel bug)
        cy.get("#filter-button").click()
        cy.get("#custom-date-range").click()
        cy.get("#date-from").should("have.value", "")
        cy.get("#date-to").should("have.value", "")
        cy.get("#date-from").type("2022-01-01")
        cy.get("#date-to").type("2022-12-31")

        cy.get(".govuk-heading-m").contains("Selected filters").should("exist")
        cy.get(".govuk-heading-s").contains("Custom date range").should("exist")
        cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022").should("exist").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
        cy.get("#date-from").should("have.value", "")
        cy.get("#date-to").should("have.value", "")

        cy.get("#custom-date-range").should("not.be.checked")
      })
    })

    describe("Urgency", () => {
      it("Should apply the 'Non-urgent cases only' filter chip", () => {
        cy.get("#filter-button").click()
        cy.get("#non-urgent").click()

        cy.get(".govuk-heading-s").contains("Urgency").should("exist")
        cy.get(".moj-filter__tag").contains("Non-urgent").should("exist")
        cy.get(".moj-filter__tag").contains("Urgent").should("not.exist")
      })

      it("Should apply the 'Urgent cases only' radio button and cancel it when the 'X' is clicked", () => {
        cy.get("#filter-button").click()
        cy.get("#urgent").click()

        cy.get(".govuk-heading-s").contains("Urgency").should("exist")
        cy.get(".moj-filter__tag").contains("Urgent").should("exist")
        cy.get(".moj-filter__tag").contains("Non-urgent").should("not.exist")

        // Removes the urgent filter chips
        cy.get("li button.moj-filter__tag").contains("Urgent").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("Case state", () => {
      it("Should apply the 'Unresolved & resolved cases' filter chip", () => {
        cy.get("#filter-button").click()
        cy.get("#unresolved-and-resolved").click()

        cy.get(".govuk-heading-s").contains("Case state").should("exist")
        cy.get(".moj-filter__tag").contains("Unresolved & resolved cases").should("exist")
        cy.get(".moj-filter__tag").contains("Resolved cases").should("not.exist")
      })

      it("Should apply the 'Resolved cases' radio button and cancel it when the 'X' is clicked", () => {
        cy.get("#filter-button").click()
        cy.get("#resolved").click()

        cy.get(".govuk-heading-s").contains("Case state").should("exist")
        cy.get(".moj-filter__tag").contains("Resolved cases").should("exist")
        cy.get(".moj-filter__tag").contains("Unresolved & resolved cases").should("not.exist")

        // Removes the urgent filter chips
        cy.get("li button.moj-filter__tag").contains("Resolved cases").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("Locked status", () => {
      it("Should apply the 'Locked cases only' filter chips then remove this chips to the original state", () => {
        cy.get("#filter-button").click()
        cy.get("#locked").click()

        cy.get(".govuk-heading-s").contains("Locked state").should("exist")
        cy.get(".moj-filter__tag").contains("Locked").should("exist")
        cy.get(".moj-filter__tag").contains("Unlocked").should("not.exist")

        cy.get("li button.moj-filter__tag").contains("Locked").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("Defendant name", () => {
      it("Should apply the 'Defendant name' filter chips then remove this chips to the original state", () => {
        cy.get("#filter-button").click()
        cy.get("input[id=keywords]").type("Foo")

        cy.get(".govuk-heading-s").contains("Defendant name").should("exist")
        cy.get(".moj-filter__tag").contains("Foo").should("exist")

        cy.get("li button.moj-filter__tag").contains("Foo").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("Court name", () => {
      it("Should apply the 'Court name' filter chips then remove this chips to the original state", () => {
        cy.get("#filter-button").click()
        cy.get("input[id=court-name]").type("Bar")

        cy.get(".govuk-heading-s").contains("Court name").should("exist")
        cy.get(".moj-filter__tag").contains("Bar").should("exist")

        cy.get("li button.moj-filter__tag").contains("Bar").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("Reason code", () => {
      it("Should apply the 'Court name' filter chips then remove this chips to the original state", () => {
        cy.get("#filter-button").click()
        cy.get("input[id=reason-code]").type("Bar")

        cy.get(".govuk-heading-s").contains("Reason code").should("exist")
        cy.get(".moj-filter__tag").contains("Bar").should("exist")

        cy.get("li button.moj-filter__tag").contains("Bar").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("PTIURN", () => {
      it("Should apply the 'PTIURN' filter chips then remove this chips to the original state", () => {
        cy.get("#filter-button").click()
        cy.get("input[id=ptiurn]").type("Bar")

        cy.get(".govuk-heading-s").contains("PTIURN").should("exist")
        cy.get(".moj-filter__tag").contains("Bar").should("exist")

        cy.get("li button.moj-filter__tag").contains("Bar").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("Selecting multiple filter chips", () => {
      it("should allow you to select 'Trigger', 'Last week', 'non-urgent'. This should display relevant header for each filter chip", () => {
        // Open filters and build filter chip query
        cy.get("#filter-button").click()
        cy.get(".govuk-checkboxes__item").contains("Triggers").click()
        cy.get("#date-range").click()
        cy.get("#date-range-last-week").click()
        cy.get("#non-urgent").click()

        // Check that relevant chips and headers are present on screen
        // Reason
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-filter__tag").contains("Exceptions").should("not.exist")
        // Urgency
        cy.get(".govuk-heading-s").contains("Urgency").should("exist")
        cy.get(".moj-filter__tag").contains("Non-urgent").should("exist")
        cy.get(".moj-filter__tag").contains("Urgent").should("not.exist")
        // Date Range
        cy.get(".govuk-heading-s").contains("Date range").should("exist")
        cy.get(".moj-filter__tag").contains("Last week").should("exist")
        cy.get(".moj-filter__tag").contains("Today").should("not.exist")
        cy.get(".moj-filter__tag").contains("Yesterday").should("not.exist")
        cy.get(".moj-filter__tag").contains("This week").should("not.exist")
        cy.get(".moj-filter__tag").contains("This month").should("not.exist")

        // submit query and display filter chips in filters applied section
        cy.get("#search").contains("Apply filters").click()
        cy.get(".moj-button-menu__wrapper .moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-button-menu__wrapper .moj-filter__tag").contains("Non-urgent").should("exist")
        cy.get(".moj-button-menu__wrapper .moj-filter__tag").contains("Last week").should("exist")
      })

      it("Should allow a user to apply 'Trigger' and 'Urgent cases only' filter, under the Applied filters section. Then selecting 'Non urgent cases only' and see the previous urgent filter removed", () => {
        cy.get(".moj-action-bar button").click()
        cy.get(".govuk-checkboxes__item").contains("Triggers").click()
        cy.get("#non-urgent").click()

        cy.get(".govuk-heading-m").contains("Selected filters").should("exist")
        cy.get(".govuk-heading-m").contains("Applied filters").should("not.exist")
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")

        cy.get(".govuk-heading-s").contains("Urgency").should("exist")
        cy.get(".moj-filter__tag").contains("Non-urgent").should("exist")
        cy.get("#search").contains("Apply filters").click()

        cy.get(".moj-action-bar button").click()

        cy.get(".govuk-heading-m + p").should("contain.text", "No filters selected")
        cy.get(".govuk-heading-m").contains("Applied filters").should("exist")
        cy.get(".govuk-heading-s").contains("Urgency").should("exist")
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-filter__tag").contains("Non-urgent").should("exist")

        cy.get("#urgent").click()
        cy.get(".govuk-heading-m").contains("Applied filters").should("exist")
        cy.get(".govuk-heading-s").contains("Urgency").should("exist")
        cy.get("#filter-panel .moj-filter__tag").contains("Non-urgent").should("not.exist")
        cy.get(".govuk-heading-m").contains("Selected filters").should("exist")
        cy.get(".moj-filter__tag").contains("Urgent").should("exist")
        cy.get(".moj-filter__tag")
          .contains("Urgent")
          .parent()
          .parent()
          .prev()
          .prev()
          .contains("Selected filters")
          .should("exist")
      })
    })

    describe('Applied filter chips to "Filter applied" section', () => {
      it("Should display the Trigger filter chip when selected", () => {
        cy.get("#filter-button").click()
        cy.get(".govuk-checkboxes__item").contains("Triggers").click()

        // Check if the correct heading and filter label are applied
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-filter__tag").contains("Exceptions").should("not.exist")

        // Check if the filter chip is applied to the "Filters applied" section at the top of the case list
        cy.contains("Apply filters").click()
        cy.get(".moj-filter-tags").contains("Triggers").should("exist")

        // Clears filter chip and check the checkbox is deselected
        cy.contains("Clear filters").click()
        cy.get("#filter-button").click()
        cy.get(".govuk-checkboxes__item").contains("Triggers").should("not.be.checked")
      })
    })

    it("Should display the 'Locked to me' filter chip when selected", () => {
      cy.get("#filter-button").click()
      cy.get(".govuk-checkboxes__item").contains("View cases allocated to me").click()

      // Check if the correct heading and filter label are applied
      cy.get(".govuk-heading-s").contains("My cases").should("exist")
      cy.get(".moj-filter__tag").contains("Cases locked to me").should("exist")

      // Check if the filter chip is applied to the "Filters applied" section at the top of the case list
      cy.contains("Apply filters").click()
      cy.get(".moj-filter__tag").contains("Cases locked to me").should("exist")
      cy.get("#filter-button").contains("Show filter").click()
      cy.get("#my-cases-filter").should("be.checked")

      // Clears filter chip and check the checkbox is deselected
      cy.contains("Hide filter").click()
      cy.contains("Clear filters").click()
      cy.get("#filter-button").contains("Show filter").click()
      cy.get("#my-cases-filter").should("not.be.checked")
    })

    it("Should apply the 'Locked to me' filter chips then remove this chips to the original state", () => {
      cy.get("#filter-button").click()
      cy.get(".govuk-checkboxes__item").contains("View cases allocated to me").click()

      cy.get(".govuk-heading-s").contains("My cases").should("exist")
      cy.get(".moj-filter__tag").contains("Cases locked to me").should("exist").trigger("click")

      cy.get(".govuk-checkboxes__item").contains("View cases allocated to me").should("not.be.checked")
    })
  })
})

export {}
