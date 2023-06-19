import hashedPassword from "../../fixtures/hashedPassword"
import { Groups } from "types/GroupName"

function setUpWithGroups(groups: Groups[]) {
  cy.task("insertUsers", {
    users: [
      {
        username: "Bichard01",
        visibleForces: ["01"],
        forenames: "Bichard Test User",
        surname: "01",
        email: "bichard01@example.com",
        password: hashedPassword
      }
    ],
    userGroups: [Groups.NewUI, ...groups]
  })
  cy.login("bichard01@example.com", "password")
  cy.visit("/bichard")
  cy.get("button[id=filter-button]").click()
}

describe("Reasons filters", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.task("clearTriggers")
    cy.task("clearUsers")

    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    ])
  })

  afterEach(() => {
    cy.task("clearUsers")
  })

  it("should display all options for supervisors", () => {
    setUpWithGroups([Groups.Supervisor])

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })

  it("should display all options for general handlers", () => {
    setUpWithGroups([Groups.GeneralHandler])

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })

  it("should display 'Triggers' and 'Bails' for trigger handlers", () => {
    setUpWithGroups([Groups.TriggerHandler])

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("not.exist")
  })

  it("should not render the reasons component for exception handlers", () => {
    setUpWithGroups([Groups.ExceptionHandler])

    cy.get("#filter-panel .reasons").should("not.exist")
  })

  it("should render the reasons component if a user has conflicting groups", () => {
    setUpWithGroups([Groups.Supervisor, Groups.ExceptionHandler])

    cy.get("#filter-panel .reasons .bails").should("exist")
    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })
})
