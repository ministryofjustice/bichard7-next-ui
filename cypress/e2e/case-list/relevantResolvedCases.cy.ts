import { subHours } from "date-fns"
import CourtCase from "services/entities/CourtCase"
import {
  confirmMultipleFieldsDisplayed,
  confirmMultipleFieldsNotDisplayed,
  defaultSetup,
  loginAndGoToUrl
} from "../../support/helpers"

describe("Only shows relevant resolved cases to the user", () => {
  before(() => {
    defaultSetup()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("shows supervisors all resolved cases from their force", () => {
    const casesConfig = [
      {
        force: "011111",
        resolved: true,
        id: 0
      },
      {
        force: "011111",
        resolved: true,
        id: 1
      },
      {
        force: "011111",
        resolved: false,
        id: 2
      },
      {
        force: "02",
        resolved: true,
        id: 3
      },
      {
        force: "03",
        resolved: false,
        id: 4
      },
      {
        force: "011111",
        resolved: false,
        id: 5
      }
    ]
    const cases: Partial<CourtCase>[] = casesConfig.map((caseConfig) => {
      const resolutionDate = subHours(new Date(), Math.random() * 100)
      return {
        errorId: caseConfig.id,
        orgForPoliceFilter: caseConfig.force,
        resolutionTimestamp: caseConfig.resolved ? resolutionDate : null
      }
    })
    cy.task("insertCourtCasesWithFields", cases)

    loginAndGoToUrl("supervisor@example.com")

    cy.get("#filter-button").click()
    cy.get(`label[for="resolved"]`).click()
    cy.get("#search").click()

    confirmMultipleFieldsDisplayed(["Case00000", "Case00001"])
    confirmMultipleFieldsNotDisplayed(["Case00002", "Case00003", "Case00004", "Case00005"])
  })

  it("shows handlers resolved cases that only they resolved exceptions for", () => {
    const casesConfig = [
      {
        force: "011111",
        resolved: true,
        resolvedBy: "Supervisor",
        id: 0
      },
      {
        force: "011111",
        resolved: true,
        resolvedBy: "Bichard01",
        id: 1
      },
      {
        force: "011111",
        resolved: false,
        id: 2
      },
      {
        force: "02",
        resolved: true,
        resolvedBy: "Bichard02",
        id: 3
      },
      {
        force: "03",
        resolved: false,
        id: 4
      },
      {
        force: "011111",
        resolved: false,
        id: 5
      },
      {
        force: "011111",
        resolved: true,
        resolvedBy: "Bichard01",
        id: 6
      }
    ]
    const cases: Partial<CourtCase>[] = casesConfig.map((caseConfig) => {
      const resolutionDate = subHours(new Date(), Math.random() * 100)
      return {
        errorId: caseConfig.id,
        orgForPoliceFilter: caseConfig.force,
        resolutionTimestamp: caseConfig.resolved ? resolutionDate : null,
        errorResolvedBy: caseConfig.resolvedBy ?? null
      }
    })
    cy.task("insertCourtCasesWithFields", cases)

    loginAndGoToUrl()

    cy.get("#filter-button").click()
    cy.get(`label[for="resolved"]`).click()
    cy.get("#search").click()

    confirmMultipleFieldsDisplayed(["Case00001", "Case00006"])
    confirmMultipleFieldsNotDisplayed(["Case00000", "Case00002", "Case00003", "Case00004", "Case00005"])
  })

  it("shows handlers resolved cases that only they resolved triggers for", () => {
    const casesConfig = [
      {
        force: "011111",
        resolved: true,
        resolvedBy: "Supervisor",
        id: 0
      },
      {
        force: "011111",
        resolved: true,
        resolvedBy: "Bichard01",
        id: 1
      },
      {
        force: "011111",
        resolved: false,
        id: 2
      },
      {
        force: "02",
        resolved: true,
        resolvedBy: "Bichard02",
        id: 3
      },
      {
        force: "03",
        resolved: false,
        id: 4
      },
      {
        force: "011111",
        resolved: false,
        id: 5
      },
      {
        force: "011111",
        resolved: true,
        resolvedBy: "Bichard01",
        id: 6
      }
    ]
    const cases: Partial<CourtCase>[] = casesConfig.map((caseConfig) => {
      const resolutionDate = subHours(new Date(), Math.random() * 100)
      return {
        errorId: caseConfig.id,
        orgForPoliceFilter: caseConfig.force,
        resolutionTimestamp: caseConfig.resolved ? resolutionDate : null
      }
    })
    cy.task("insertCourtCasesWithFields", cases)

    casesConfig
      .filter((c) => !!c.resolvedBy)
      .forEach((caseConfig) => {
        cy.task("insertTriggers", {
          caseId: caseConfig.id,
          triggers: [
            {
              triggerId: caseConfig.id,
              triggerCode: "TRPR0010",
              status: "Resolved",
              createdAt: new Date("2023-03-07T10:22:34.000Z"),
              resolvedBy: caseConfig.resolvedBy,
              resolvedAt: new Date("2023-03-07T12:22:34.000Z")
            }
          ]
        })
      })

    loginAndGoToUrl()

    cy.get("#filter-button").click()
    cy.get(`label[for="resolved"]`).click()
    cy.get("#search").click()

    confirmMultipleFieldsDisplayed(["Case00001", "Case00006"])
    confirmMultipleFieldsNotDisplayed(["Case00000", "Case00002", "Case00003", "Case00004", "Case00005"])
  })
})
