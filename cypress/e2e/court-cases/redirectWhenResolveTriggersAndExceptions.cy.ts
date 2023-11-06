import { TestTrigger } from "../../../test/utils/manageTriggers"
import hashedPassword from "../../fixtures/hashedPassword"

const testData: {
  loggedInAs: string
  hasExceptions: boolean
  hasTriggers: boolean
  resolveTriggers: boolean
  resolveExceptions?: boolean
  expectedPath: string
  exceptionsFeatureFlagEnabled: boolean
}[] = [
  {
    loggedInAs: "GeneralHandler",
    hasExceptions: false,
    hasTriggers: true,
    resolveTriggers: true,
    resolveExceptions: false,
    expectedPath: "case list page",
    exceptionsFeatureFlagEnabled: true
  },
  {
    loggedInAs: "GeneralHandler",
    hasExceptions: true,
    hasTriggers: true,
    resolveTriggers: true,
    resolveExceptions: true,
    expectedPath: "case list page",
    exceptionsFeatureFlagEnabled: true
  },
  {
    loggedInAs: "GeneralHandler",
    hasExceptions: true,
    hasTriggers: true,
    resolveTriggers: true,
    expectedPath: "case details page", // users using the switch button on the case to complete exceptions on old Bichard
    exceptionsFeatureFlagEnabled: false
  }
]

describe("Redirect when resolve triggers and exceptions", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  testData.forEach(
    ({
      loggedInAs,
      expectedPath,
      hasExceptions,
      hasTriggers,
      resolveExceptions,
      resolveTriggers,
      exceptionsFeatureFlagEnabled
    }) => {
      it(`Should redirect to ${expectedPath} when user is a ${loggedInAs} and there are ${
        hasExceptions ? "unresolved exceptions" : ""
      } ${hasExceptions && hasTriggers ? "and" : ""} ${hasTriggers ? "unresolved triggers" : ""} and ${loggedInAs} ${
        resolveExceptions ? "resolves exceptions" : ""
      } ${resolveExceptions && resolveTriggers ? "and" : ""} ${resolveTriggers ? "resolves triggers" : ""} ${
        !exceptionsFeatureFlagEnabled ? "and exceptions feature flag is disabled" : ""
      }`, () => {
        cy.task("clearUsers")
        cy.task("insertUsers", {
          users: [
            {
              username: `${loggedInAs} username`,
              visibleForces: ["01"],
              forenames: `${loggedInAs}'s forename`,
              surname: `${loggedInAs}surname`,
              email: `${loggedInAs}@example.com`,
              password: hashedPassword,
              featureFlags: { exceptionsEnabled: exceptionsFeatureFlagEnabled }
            }
          ],
          userGroups: ["B7NewUI_grp", `B7${loggedInAs}_grp`]
        })

        cy.task("clearCourtCases")
        cy.task("insertCourtCasesWithFields", [
          {
            orgForPoliceFilter: "01",
            errorStatus: hasExceptions ? "Unresolved" : null,
            errorCount: hasExceptions ? 1 : 0,
            triggerStatus: hasTriggers ? "Unresolved" : null
          }
        ])

        if (hasTriggers) {
          const caseTriggers: Partial<TestTrigger>[] = [
            {
              triggerCode: "TRPR0001",
              status: "Unresolved",
              createdAt: new Date("2022-07-09T10:22:34.000Z")
            }
          ]
          cy.task("insertTriggers", { caseId: 0, triggers: caseTriggers })
        }

        cy.login(`${loggedInAs}@example.com`, "password")
        cy.visit("/bichard/court-cases/0")

        if (resolveExceptions && exceptionsFeatureFlagEnabled) {
          if (loggedInAs === "GeneralHandler") {
            cy.get(".triggers-and-exceptions-sidebar #exceptions-tab").click()
          }
          cy.get("button").contains("Mark as manually resolved").click()
          cy.get("button").contains("Resolve").click()
        }

        if (resolveTriggers) {
          cy.get("#select-all-triggers button").click()
          cy.get("#mark-triggers-complete-button").click()
        }

        if (expectedPath === "case list page") {
          cy.url().should("match", /\/bichard$/)
        } else if (expectedPath === "case details page") {
          cy.url().should("match", /\/court-cases\/\d+/)
        }
      })
    }
  )
})

export {}
