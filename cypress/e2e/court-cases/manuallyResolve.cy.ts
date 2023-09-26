import User from "services/entities/User"
import hashedPassword from "../../fixtures/hashedPassword"

describe("Manually resolve a case", () => {
  const defaultUsers: Partial<User>[] = Array.from(Array(2)).map((_value, idx) => {
    return {
      username: `Bichard0${idx}`,
      visibleForces: [`0${idx}`],
      forenames: "Bichard Test User",
      surname: `0${idx}`,
      email: `bichard0${idx}@example.com`,
      password: hashedPassword
    }
  })

  before(() => {
    cy.task("clearUsers")
    cy.task("insertUsers", { users: defaultUsers, userGroups: ["B7NewUI_grp", "B7GeneralHandler_grp"] })
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
        errorLockedByUsername: "Bichard01",
        triggerLockedByUsername: "Bichard01"
      }
    ])

    cy.login("bichard01@example.com", "password")

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
    cy.contains("Bichard01: Portal Action: Record Manually Resolved. Reason: PNCRecordIsAccurate. Reason Text:")
  })

  it("Should prompt the user to enter resolution details if the reason is Reallocated", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 0,
        errorLockedByUsername: "Bichard01",
        triggerLockedByUsername: "Bichard01"
      }
    ])
    cy.login("bichard01@example.com", "password")

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
      "Bichard01: Portal Action: Record Manually Resolved. Reason: Reallocated. Reason Text: Some reason text"
    )
  })

  it("Should return 404 for a case that this user can not see", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "02" }])
    cy.login("bichard01@example.com", "password")

    cy.request({
      failOnStatusCode: false,
      url: "/bichard/court-cases/0/resolve"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("Should return 404 for a case that does not exist", () => {
    cy.login("bichard01@example.com", "password")

    cy.request({
      failOnStatusCode: false,
      url: "/court-cases/1/notes/resolve"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })
})

export {}
