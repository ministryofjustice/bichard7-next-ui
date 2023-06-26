import hashedPassword from "../../fixtures/hashedPassword"
import { Groups } from "types/GroupName"

const newUserLoginWithGroups = (groups: Groups[]) => {
  const user = groups.map((g) => g.toLowerCase()).join("") || "nogroups"
  const email = `${user}@example.com`
  cy.task("insertUsers", {
    users: [
      {
        username: user,
        visibleForces: ["01"],
        forenames: "Bichard Test User",
        surname: "01",
        email: email,
        password: hashedPassword
      }
    ],
    userGroups: [Groups.NewUI, ...groups]
  })
  cy.login(email, "password")
}

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

  it("should display all options if no user group is specified", () => {
    newUserLoginWithGroups([])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })

  it("should display all options for supervisors", () => {
    newUserLoginWithGroups([Groups.Supervisor])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })

  it("should display all options for general handlers", () => {
    newUserLoginWithGroups([Groups.GeneralHandler])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })

  it("should display 'Triggers' and 'Bails' for trigger handlers", () => {
    newUserLoginWithGroups([Groups.TriggerHandler])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
  })

  it("should not display 'Exceptions' for trigger handlers", () => {
    newUserLoginWithGroups([Groups.TriggerHandler])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .exceptions").should("not.exist")
  })

  it("should not render the reasons component for exception handlers", () => {
    newUserLoginWithGroups([Groups.ExceptionHandler])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons").should("not.exist")
  })

  it("should render the correct reasons if a user has conflicting groups", () => {
    newUserLoginWithGroups([Groups.Supervisor, Groups.ExceptionHandler])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })
})
