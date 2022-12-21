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
      cy.viewport(1280, 720)
      cy.login("bichard01@example.com", "password")
    })

    it("Should display no filters chips as the default state", () => {
      cy.get('[class^="moj-action-bar"]').click()
      cy.get('*[class^="moj-filter-tag"]').should("not.be.visible")
      cy.get('*[class^="govuk-checkboxes__item"]').should("not.be.checked")
      cy.get('*[class^="govuk-radios__input"]').should("not.be.checked")
    })

    describe("Case type", () => {
      it("Should display the Trigger filter chip when selected", () => {
        cy.get('[class^="moj-action-bar"]').click()
        cy.get('*[class^="govuk-checkboxes__item"]').contains("Triggers").click()

        // Check if the correct heading and filter label are applied
        cy.get('*[class^="moj-filter__selected-heading"').contains("Reason").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Triggers").should("exist")
        cy.get('*[class^="moj-filter-tag"]').contains("Exceptions").should("not.exist")
      })

      it("Should remove the Trigger filter chip when the chip is clicked and remove the selected option in the filter panel", () => {
        cy.get('[class^="moj-action-bar"]').click()
        cy.get('*[class^="govuk-checkboxes__item"]').contains("Triggers").click()

        // Check if the correct heading and filter label are applied
        cy.get('*[class^="moj-filter__selected-heading"').contains("Reason").should("exist")
        cy.get('*[class^="moj-filter-tag"]').contains("Triggers").should("exist")
        cy.get('*[class^="moj-filter-tag"]').contains("Exceptions").should("not.exist")

        // Removes the filter chip
        cy.get('li button[class ^="moj-filter__tag"]').trigger("click")
        cy.get('*[class^="moj-filter-tag"]').contains("Trigger").should("not.exist")
      })

      it("Should display Trigger and Exception filter chips when selected", () => {
        // Shows filters and clicks both options
        cy.get('[class^="moj-action-bar"]').click()
        cy.get('*[class^="govuk-checkboxes__item"]').contains("Triggers").click()
        cy.get('*[class^="govuk-checkboxes__item"]').contains("Exception").click()

        // Check if the correct heading for chips and filter labels are applied
        cy.get('ul[class^="moj-filter-tags"]').contains("Reason").should("exist")
        cy.get('*[class^="moj-filter__selected"]').contains("Trigger").should("exist")
        cy.get('*[class^="moj-filter__selected"]').contains("Exception").should("exist")
      })

      it("Should display Trigger and Exception filter chips when selected", () => {
        // Shows filters and clicks both options
        cy.get('[class^="moj-action-bar"]').click()
        cy.get('*[class^="govuk-checkboxes__item"]').contains("Triggers").click()
        cy.get('*[class^="govuk-checkboxes__item"]').contains("Exception").click()

        // Check if the correct heading for chips and filter labels are applied
        cy.get('ul[class^="moj-filter-tags"]').contains("Reason").should("exist")
        cy.get('*[class^="moj-filter__selected"]').contains("Trigger").should("exist")
        cy.get('*[class^="moj-filter__selected"]').contains("Exception").should("exist")
      })

      it("Should remove the Trigger and Exception filter chips when both chips are clicked and remove the selected option in the filter panel", () => {
        // Shows filters and clicks both options
        cy.get('[class^="moj-action-bar"]').click()
        cy.get('*[class^="govuk-checkboxes__item"]').contains("Triggers").click()
        cy.get('*[class^="govuk-checkboxes__item"]').contains("Exception").click()

        // Check if the correct heading for chips and filter labels are applied
        cy.get('*[class^="moj-filter-tags"').contains("Reason").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Triggers").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Exception").should("exist")
        cy.get('*[class^="moj-filter-tags"]').children().should("have.length", 3)

        // Removes the two filter chips
        cy.get('li button[class ^="moj-filter__tag"]').contains("Triggers").trigger("click")
        cy.get('li button[class ^="moj-filter__tag"]').contains("Exception").trigger("click")
        cy.get('*[class^="moj-filter-tag"]').should("not.contain", "Trigger").and("not.contain", "Exception")
      })
    })

    describe("Date range", () => {
      it("Should allow you to add 'today' as the date range filter chip", () => {
        cy.get('[class^="moj-action-bar"]').click()
        cy.get("#date-range").click()
        cy.get("#date-range-today").click()

        cy.get('*[class^="moj-filter__selected-heading"').contains("Date range").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Today").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Yesterday").should("not.exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("This week").should("not.exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Last week").should("not.exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("This month").should("not.exist")
      })
    })

    describe("Urgency", () => {
      it("Should apply the 'Urgent cases only' radio button", () => {
        cy.get('[class^="moj-action-bar"]').click()
        cy.get("#urgent").click()

        cy.get('*[class^="moj-filter__selected-heading"').contains("Urgency").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Urgent").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Non-urgent").should("not.exist")
      })

      it("Should apply the 'Non-urgent cases only' radio button", () => {
        cy.get('[class^="moj-action-bar"]').click()
        cy.get("#non-urgent").click()

        cy.get('*[class^="moj-filter__selected-heading"').contains("Urgency").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Non-urgent").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Urgent").should("not.exist")
      })

      it("Should remove the 'Urgent cases only' filter chip when the correct chip is 'X' is clicked", () => {
        cy.get('[class^="moj-action-bar"]').click()
        cy.get("#urgent").click()

        cy.get('*[class^="moj-filter__selected-heading"').contains("Urgency").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Urgent").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Non-urgent").should("not.exist")
        cy.get('li button[class^="moj-filter__tag"]').children().should("have.length", 1)

        // Removes the urgent filter chips
        cy.get('li button[class ^="moj-filter__tag"]').contains("Urgent").trigger("click")
        cy.get('h2[class^="govuk-heading-m govuk-!-margin-bottom-0"]').children().should("have.length", 0)
      })
    })

    describe("Locked status", () => {
      it("", () => {})
    })

    describe("Selecting multiple filter chips", () => {
      it.only("should allow you to select 'Trigger', 'Last week', 'non-urgent'. This should display relevant header for each filter chip", () => {
        // Open filters and build filter chip query
        cy.get('[class^="moj-action-bar"]').click()
        cy.get('*[class^="govuk-checkboxes__item"]').contains("Triggers").click()
        cy.get("#date-range").click()
        cy.get("#date-range-last-week").click()
        cy.get("#non-urgent").click()

        // Check that relevant chips and headers are present on screen
        // Reasons
        cy.get('*[class^="moj-filter__selected-heading"').contains("Reason").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Triggers").should("exist")
        cy.get('*[class^="moj-filter-tag"]').contains("Exceptions").should("not.exist")
        // Urgency
        cy.get('*[class^="moj-filter__selected-heading"').contains("Urgency").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Non-urgent").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Urgent").should("not.exist")
        // Date Range
        cy.get('*[class^="moj-filter__selected-heading"').contains("Date range").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Last week").should("exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Today").should("not.exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("Yesterday").should("not.exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("This week").should("not.exist")
        cy.get('*[class^="moj-filter__selected-heading"').contains("This month").should("not.exist")
      })
    })
  })
})

export {}
