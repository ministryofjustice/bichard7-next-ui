import canManuallyResolveAndSubmitTestData from "../../../fixtures/canManuallyResolveAndSubmitTestData.json"
import hashedPassword from "../../../fixtures/hashedPassword"

describe("Exception permissions", () => {
  const insertUsers = (userRoles: string[]) => {
    userRoles.forEach((userRole: string) => {
      cy.task("insertUsers", {
        users: [
          {
            username: `${userRole} username`,
            visibleForces: [1],
            forenames: `${userRole}'s forename`,
            surname: `${userRole}surname`,
            email: `${userRole}@example.com`,
            password: hashedPassword
          }
        ],
        userGroups: ["B7NewUI_grp", `B7${userRole}_grp`]
      })
    })
  }

  before(() => {
    cy.task("clearUsers")
    insertUsers(["GeneralHandler", "ExceptionHandler", "TriggerHandler", "Supervisor"])
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  canManuallyResolveAndSubmitTestData.forEach(
    ({
      canManuallyResolveAndSubmit,
      exceptionStatus,
      exceptionLockedByAnotherUser,
      loggedInAs,
      exceptionsFeatureFlagEnabled
    }) => {
      it(`Should ${
        canManuallyResolveAndSubmit ? "be able to resolve or submit" : "NOT be able to resolve or submit"
      } when exceptions are ${exceptionStatus}, ${
        exceptionLockedByAnotherUser ? "locked by another user" : "locked by current user"
      } and user is a ${loggedInAs} ${
        !exceptionsFeatureFlagEnabled ? "and exceptions feature flag is disabled" : ""
      }`, () => {
        if (!exceptionsFeatureFlagEnabled) {
          cy.task("clearUsers")
          cy.task("insertUsers", {
            users: [
              {
                username: `${loggedInAs} username`,
                visibleForces: [1],
                forenames: `${loggedInAs}'s forename`,
                surname: `${loggedInAs}surname`,
                email: `${loggedInAs}@example.com`,
                password: hashedPassword,
                featureFlags: { exceptionsEnabled: false }
              }
            ],
            userGroups: ["B7NewUI_grp", "B7GeneralHandler_grp"]
          })
        }
        cy.task("insertCourtCasesWithFields", [
          {
            orgForPoliceFilter: "01",
            errorStatus: exceptionStatus,
            errorLockedByUsername: exceptionLockedByAnotherUser ? "Bichard03" : `${loggedInAs} username`
          }
        ])
        cy.login(`${loggedInAs}@example.com`, "password")
        cy.visit("/bichard/court-cases/0")

        if (loggedInAs === "GeneralHandler") {
          cy.get(".triggers-and-exceptions-sidebar #exceptions-tab").click()
        }

        if (canManuallyResolveAndSubmit) {
          cy.get("button").contains("Mark as manually resolved").should("exist")
          cy.get("button").contains("Submit exception(s)").should("exist")
        } else {
          cy.get("button").contains("Mark as manually resolved").should("not.exist")
          cy.get("button").contains("Submit exception(s)").should("not.exist")
        }

        cy.request({
          failOnStatusCode: false,
          url: "/bichard/court-cases/0/resolve"
        }).then((response) => {
          expect(response.status).to.eq(canManuallyResolveAndSubmit ? 200 : 403)
        })
      })
    }
  )
})

export {}
