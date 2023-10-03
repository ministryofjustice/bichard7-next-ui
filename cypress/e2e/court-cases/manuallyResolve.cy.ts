import hashedPassword from "../../fixtures/hashedPassword"
import canManuallyResolveAndSubmitTestData from "../../fixtures/canManuallyResolveAndSubmitTestData.json"

describe("Manually resolve a case", () => {
  const insertUsers = (userRoles: string[]) => {
    userRoles.forEach((userRole: string) => {
      cy.task("insertUsers", {
        users: [
          {
            username: `${userRole} username`,
            visibleForces: ["01"],
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

  it("Should be able to resolve a case which is visible and locked by the user", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 0,
        errorLockedByUsername: "GeneralHandler username",
        triggerLockedByUsername: "GeneralHandler username"
      }
    ])

    cy.login("GeneralHandler@example.com", "password")

    cy.visit("/bichard")

    cy.findByText("NAME Defendant").click()

    cy.get(".triggers-and-exceptions-sidebar #exceptions-tab").click()
    cy.get("button").contains("Mark As Manually Resolved").click()
    cy.get("H2").should("have.text", "Resolve Case")
    cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="reason"]').select("PNCRecordIsAccurate")
    cy.get("button").contains("Resolve").click()

    cy.get("H1").should("have.text", "Case details")

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains(
      "GeneralHandler username: Portal Action: Record Manually Resolved. Reason: PNCRecordIsAccurate. Reason Text:"
    )
  })

  it("Should prompt the user to enter resolution details if the reason is Reallocated", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 0,
        errorLockedByUsername: "GeneralHandler username",
        triggerLockedByUsername: "GeneralHandler username"
      }
    ])
    cy.login("GeneralHandler@example.com", "password")

    cy.visit("/bichard")

    cy.findByText("NAME Defendant").click()

    cy.get(".triggers-and-exceptions-sidebar #exceptions-tab").click()
    cy.get("button").contains("Mark As Manually Resolved").click()
    cy.get("H2").should("have.text", "Resolve Case")
    cy.findByText("Case Details").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="reason"]').select("Reallocated")
    cy.get("button").contains("Resolve").click()

    cy.contains("Reason text is required").should("be.visible")

    cy.get("textarea").type("Some reason text")
    cy.get("button").contains("Resolve").click()

    cy.get("H1").should("have.text", "Case details")

    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains(
      "GeneralHandler username: Portal Action: Record Manually Resolved. Reason: Reallocated. Reason Text: Some reason text"
    )
  })

  it("Should return 404 for a case that this user can not see", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "02" }])
    cy.login("GeneralHandler@example.com", "password")

    cy.request({
      failOnStatusCode: false,
      url: "/bichard/court-cases/0/resolve"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("Should return 404 for a case that does not exist", () => {
    cy.login("GeneralHandler@example.com", "password")

    cy.request({
      failOnStatusCode: false,
      url: "/court-cases/1/notes/resolve"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  canManuallyResolveAndSubmitTestData.forEach(
    ({ canManuallyResolveAndSubmit, exceptionStatus, exceptionLockedByAnotherUser, loggedInAs }) => {
      it(`Should ${
        canManuallyResolveAndSubmit ? "be able to resolve or submit" : "NOT be able to resolve or submit"
      } when exceptions are ${exceptionStatus}, ${
        exceptionLockedByAnotherUser ? "locked by another user" : "locked by current user"
      } and user is a ${loggedInAs}`, () => {
        cy.task("insertCourtCasesWithFields", [
          {
            orgForPoliceFilter: "01",
            errorStatus: exceptionStatus,
            errorLockedByUsername: exceptionLockedByAnotherUser ? "Bichard03" : `${loggedInAs} username`
          }
        ])

        cy.login(`${loggedInAs}@example.com`, "password")
        cy.visit("/bichard/court-cases/0")

        if (loggedInAs === "GeneralHander") {
          cy.get(".triggers-and-exceptions-sidebar #exceptions-tab").click()
        }

        if (canManuallyResolveAndSubmit) {
          cy.get("button").contains("Mark As Manually Resolved").should("exist")
          // TODO check submit button should exists
        } else {
          cy.get("button").contains("Mark As Manually Resolved").should("not.exist")
          // TODO check submit button should not exists
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
