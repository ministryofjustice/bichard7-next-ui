import { defaultSetup, loginAndGoToUrl } from "../../support/helpers"

describe("Persist applied filters", () => {
  before(() => {
    defaultSetup()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should persist applied filters", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 100, force: "01" })

    loginAndGoToUrl()

    cy.get("#filter-button").click()
    cy.get("#keywords").type("Defendant Name")
    cy.get("#search").click()

    cy.get("li.moj-pagination__item").contains("Next").click()
    cy.get(".moj-pagination__item--active").contains("2")

    cy.visit("/bichard")
    cy.get("#filter-button").click()
    cy.get("#keywords").should("have.value", "Defendant Name")
    cy.get(".moj-pagination__item--active").contains("2")
  })

  it("Should clear the applied filters", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 100, force: "01" })

    loginAndGoToUrl()

    cy.get("#filter-button").click()
    cy.get("#keywords").type("Defendant Name")
    cy.get("#search").click()

    cy.get("li.moj-pagination__item").contains("Next").click()
    cy.get(".moj-pagination__item--active").contains("2")

    cy.visit("/bichard")
    cy.get("#filter-button").click()
    cy.get("#keywords").should("have.value", "Defendant Name")
    cy.get(".moj-pagination__item--active").contains("2")

    cy.get(".moj-filter__heading-title a").contains("Clear filters").click({ force: true })
    cy.reload()

    cy.visit("/bichard")
    cy.get("#filter-button").click()
    cy.get("#keywords").should("not.have.value", "Defendant Name")
    cy.get(".moj-pagination__item--active").contains("1")
  })
})
