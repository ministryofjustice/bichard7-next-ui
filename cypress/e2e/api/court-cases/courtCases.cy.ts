import User from "../../../../src/services/entities/User"
import hashedPassword from "../../../fixtures/hashedPassword"

describe("Court cases API endpoint", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.task("clearUsers")
    cy.task("insertUsers", {
      users: [
        {
          username: "Bichard01",
          visibleForces: ["01"],
          forenames: "Bichard Test User",
          surname: "Bichard user",
          email: "bichard01@example.com",
          password: hashedPassword
        } as Partial<User>
      ],
      userGroups: ["B7NewUI_grp", "B7GeneralHandler_grp"]
    })
    cy.clearCookies()
  })

  it("returns 401 if the user is unauthenticated", () => {
    cy.request({
      method: "PATCH",
      url: "bichard/api/court-cases/1",
      headers: { Referer: "/users/users" },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property("message", "Unauthorized")
    })
  })

  it("returns 200 if the user is authenticated", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "01", errorLockedByUsername: "Bichard01", triggerLockedByUsername: "Bichard01" }
    ])
    cy.login("bichard01@example.com", "password")
    cy.request({
      method: "PATCH",
      body: { errorLockedByUsername: "SomeUser" },
      url: "bichard/api/court-cases/0",
      headers: { Referer: "/users/users" }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("success", true)
    })
  })
})
