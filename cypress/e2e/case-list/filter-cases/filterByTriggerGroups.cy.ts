import a11yConfig from "../../../support/a11yConfig"
import logAccessibilityViolations from "../../../support/logAccessibilityViolations"

describe("Filtering cases by trigger groups", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.loginAs("GeneralHandler")
  })

  it("Should be accessible with trigger group is unchecked", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").should("not.be.checked")

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("Should be accessible with trigger group is checked", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()
    cy.get("input#bails").should("be.checked")

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("Should be accessible with trigger group is indeterminate", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()
    cy.get("input#trpr0008").click()
    cy.get("input#bails:indeterminate").should("exist")

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("should show reason codes in the reason codes input when we click on Bails", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()

    cy.get("input#reasonCodes").should("value", "PR08 PR10 PR20 PR30")
  })

  it("should show reason codes in the reason codes input when we click on Custody", () => {
    cy.visit("/bichard")

    cy.get("input#custody").should("exist")
    cy.get("input#custody").click()

    cy.get("input#reasonCodes").should("value", "PR01 PR05 PR06 PR19 PR21")
  })

  it("should show reason codes in the reason codes input when we click on Orders", () => {
    cy.visit("/bichard")

    cy.get("input#orders").should("exist")
    cy.get("input#orders").click()

    cy.get("input#reasonCodes").should("value", "PR03 PR16 PR25 PR26 PR29 PS08")
  })

  it("should show reason codes in the reason codes input when we click on Warrants", () => {
    cy.visit("/bichard")

    cy.get("input#warrants").should("exist")
    cy.get("input#warrants").click()

    cy.get("input#reasonCodes").should("value", "PR02 PR12")
  })

  it("should show reason codes filter chips when we click on a trigger group", () => {
    cy.visit("/bichard")

    cy.get("input#warrants").should("exist")
    cy.get("input#warrants").click()

    cy.get(".moj-filter__tag").contains("PR02")
    cy.get(".moj-filter__tag").contains("PR12")
  })
})
