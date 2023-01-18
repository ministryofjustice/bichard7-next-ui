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
      cy.visit("/bichard")
    })

    it("Should display no filters chips as the default state", () => {
      cy.get("#filter-button").click()
      cy.get(".moj-filter__tag").should("not.exist")
      cy.get(".moj-filter__selected").should("not.exist")
      cy.get(".govuk-checkboxes__item").should("not.be.checked")
      cy.get(".govuk-radios__input").should("not.be.checked")
    })

    describe("Case type", () => {
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

        // Removes the filter chip
        cy.get("li button.moj-filter__tag").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
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
        // Reasons
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

        cy.get(".govuk-heading-m").contains("Selected filters").should("not.exist")
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
  })
})

export {}
