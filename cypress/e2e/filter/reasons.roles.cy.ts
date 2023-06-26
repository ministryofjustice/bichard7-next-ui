import hashedPassword from "../../fixtures/hashedPassword"
import { UserGroup } from "types/UserGroup"

const newUserLoginWithGroups = (groups: UserGroup[]) => {
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
    userGroups: [UserGroup.NewUI, ...groups]
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
    newUserLoginWithGroups([UserGroup.Supervisor])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })

  it("should display all options for general handlers", () => {
    newUserLoginWithGroups([UserGroup.GeneralHandler])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })

  it("should display 'Triggers' and 'Bails' for trigger handlers", () => {
    newUserLoginWithGroups([UserGroup.TriggerHandler])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
  })

  it("should not display 'Exceptions' for trigger handlers", () => {
    newUserLoginWithGroups([UserGroup.TriggerHandler])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .exceptions").should("not.exist")
  })

  it("should not render the reasons component for exception handlers", () => {
    newUserLoginWithGroups([UserGroup.ExceptionHandler])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons").should("not.exist")
  })

  it("should render the correct reasons if a user has conflicting groups", () => {
    newUserLoginWithGroups([UserGroup.Supervisor, UserGroup.ExceptionHandler])
    navigateAndShowFilters()

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })
})
