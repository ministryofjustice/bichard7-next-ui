import User from "../../../../src/services/entities/User"
import hashedPassword from "../../../fixtures/hashedPassword"

describe("Court case details header", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.task("clearUsers")
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
      ] as Partial<User>[],
      userGroups: ["B7NewUI_grp"]
    })
    cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7TriggerHandler_grp" })
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  describe("Resolution status badge", () => {
    it("Should show the submitted badge when exceptions submitted", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "01",
          errorCount: 1,
          errorStatus: "Submitted",
          triggerCount: 1,
          triggerStatus: "Resolved"
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get(".moj-badge-submitted").contains("Submitted").should("exist").should("be.visible")
      cy.get(".view-only-badge").contains("View only").should("exist").should("be.visible")
    })

    it("Should show the resolved badge when both triggers and exceptions are resolved", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "01",
          errorCount: 1,
          errorStatus: "Resolved",
          triggerCount: 1,
          triggerStatus: "Resolved"
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get(".moj-badge-resolved").contains("Resolved").should("exist").should("be.visible")
      cy.get(".view-only-badge").contains("View only").should("exist").should("be.visible")
    })

    it("Should not show the resolved badge when the case is partially resolved", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "01",
          errorCount: 1,
          errorStatus: "Resolved",
          triggerCount: 1,
          triggerStatus: "Unresolved"
        },
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "01",
          errorCount: 1,
          errorStatus: "Unresolved",
          triggerCount: 1,
          triggerStatus: "Resolved"
        }
      ])

      cy.login("bichard01@example.com", "password")

      cy.visit("/bichard/court-cases/0")
      cy.get(".moj-badge-resolved").should("not.exist")

      cy.visit("/bichard/court-cases/1")
      cy.get(".moj-badge-resolved").should("not.exist")
    })

    it("Should show the resolved badge when triggers resolved and there are no exceptions", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "01",
          errorCount: 0,
          errorStatus: null,
          triggerCount: 1,
          triggerStatus: "Resolved"
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get(".moj-badge-resolved").contains("Resolved").should("exist").should("be.visible")
      cy.get(".view-only-badge").contains("View only").should("exist").should("be.visible")
    })

    it("Should show the resolved badge when exceptions resolved and there are no triggers", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "01",
          errorCount: 1,
          errorStatus: "Resolved",
          triggerCount: 0,
          triggerStatus: null
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.get(".moj-badge-resolved").contains("Resolved").should("exist").should("be.visible")
      cy.get(".view-only-badge").contains("View only").should("exist").should("be.visible")
    })
  })
})
