import { UserGroup } from "types/UserGroup"
import { newUserLogin } from "../../support/helpers"

const navigateAndShowFilters = () => {
  cy.visit("/bichard")
  cy.get("button[id=filter-button]").click()
}

describe("Reasons filters", () => {
  before(() => {
    cy.task("clearUsers")
  })

  afterEach(() => {
    cy.task("clearUsers")
  })

  it("should not render the reasons component if no user group is specified", () => {
    newUserLogin({})
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons").should("not.exist")
  })

  it("should display all options for supervisors", () => {
    newUserLogin({
      groups: [UserGroup.Supervisor]
    })
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })

  it("should display all options for general handlers", () => {
    newUserLogin({ groups: [UserGroup.GeneralHandler] })
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })

  it("should display 'Triggers' and 'Bails' for trigger handlers", () => {
    newUserLogin({ groups: [UserGroup.TriggerHandler] })
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
  })

  it("should not display 'Exceptions' for trigger handlers", () => {
    newUserLogin({ groups: [UserGroup.TriggerHandler] })
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .exceptions").should("not.exist")
  })

  it("should not render the reasons component for exception handlers", () => {
    newUserLogin({ groups: [UserGroup.ExceptionHandler] })
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons").should("not.exist")
  })

  it("should render the correct reasons if a user has conflicting groups", () => {
    newUserLogin({
      groups: [UserGroup.Supervisor, UserGroup.ExceptionHandler]
    })
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })
})
