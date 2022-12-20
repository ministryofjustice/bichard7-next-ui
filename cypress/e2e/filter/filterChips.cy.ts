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

    it("Should display the Trigger filter chip when selected", () => {
      cy.get('[class^="moj-action-bar"]').click()
      cy.get('*[class^="govuk-checkboxes__item"]').contains("Triggers").click()

      cy.get('*[class^="moj-filter__selected-heading"').contains("Reason").should("exist")
      cy.get('*[class^="moj-filter__selected-heading"').contains("Triggers").should("exist")
    })

    it("Should remove the Trigger filter chip when the chip is clicked and remove the selected option in the filter panel", () => {
      cy.get('[class^="moj-action-bar"]').click()
      cy.get('*[class^="govuk-checkboxes__item"]').contains("Triggers").click()

      cy.get('*[class^="moj-filter__selected-heading"').contains("Reason").should("exist")
      cy.get('*[class^="moj-filter-tag"]').contains("Triggers").should("exist")

      cy.get('li button[class ^="moj-filter__tag"]').trigger("click")
      cy.get('ui [class^="moj-filter-tags"]').should("have.length", 0)
    })

    it("Should display Trigger and Exception filter chips when selected", () => {
      cy.get('[class^="moj-action-bar"]').click()
      cy.get('*[class^="govuk-checkboxes__item"]').contains("Triggers").click()
      cy.get('*[class^="govuk-checkboxes__item"]').contains("Exception").click()

      cy.get('*[class^="moj-filter__selected-heading"').contains("Reason").should("exist")
      cy.get('*[class^="moj-filter__selected-heading"').contains("Trigger").should("exist")
      cy.get('*[class^="moj-filter__selected-heading"').contains("Exception").should("exist")
    })

    it.only("Should remove the Trigger and Exception filter chip when both chips are clicked and remove the selected option in the filter panel", () => {
      cy.get('[class^="moj-action-bar"]').click()
      cy.get('*[class^="govuk-checkboxes__item"]').contains("Triggers").click()
      cy.get('*[class^="govuk-checkboxes__item"]').contains("Exception").click()

      cy.get('*[class^="moj-filter__selected-heading"').contains("Reason").should("exist")
      cy.get('*[class^="moj-filter__selected-heading"').contains("Triggers").should("exist")
      cy.get('*[class^="moj-filter__selected-heading"').contains("Exception").should("exist")
      cy.get('li button[class^="moj-filter__tag"]').children().should("have.length", 2)

      cy.get('li button[class ^="moj-filter__tag"]').contains("Triggers").trigger("click")
      cy.get('li button[class ^="moj-filter__tag"]').contains("Exception").trigger("click")

      cy.get('h2[class^="govuk-heading-m govuk-!-margin-bottom-0"]').children().should("have.length", 0)
    })
  })
})

export {}
