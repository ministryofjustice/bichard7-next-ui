describe("View resolution status", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.loginAs("TriggerHandler")
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

      cy.visit("/bichard/court-cases/0")

      cy.get(".moj-badge-resolved").contains("Resolved").should("exist").should("be.visible")
      cy.get(".view-only-badge").contains("View only").should("exist").should("be.visible")
    })
  })
})
