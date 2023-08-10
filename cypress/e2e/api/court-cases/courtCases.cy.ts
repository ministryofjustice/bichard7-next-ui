import User from "../../../../src/services/entities/User"
import hashedPassword from "../../../fixtures/hashedPassword"

describe("Court cases API endpoint", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.task("clearUsers")
    cy.task("insertUsers", {
      users: [
        {
          username: "Bichard00",
          visibleForces: [`00`],
          forenames: "Bichard Test User",
          surname: "00",
          email: "bichard00@example.com",
          password: hashedPassword
        } as Partial<User>
      ],
      userGroups: ["B7NewUI_grp"]
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
    cy.login("bichard00@example.com", "password")
    cy.request({
      method: "PATCH",
      url: "bichard/api/court-cases/1",
      headers: { Referer: "/users/users" },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("success", true)
    })
  })
})
