/* eslint-disable cypress/no-async-tests */
import hashedPassword from "../fixtures/hashedPassword"
import User from "services/entities/User"
import { loginAndGoToUrl } from "../support/helpers"

describe("Authentication tests", () => {
  const defaultUsers: Partial<User>[] = Array.from(Array(5)).map((_value, idx) => {
    return {
      username: `Bichard0${idx}`,
      visibleForces: [`00${idx}`],
      visibleCourts: [`${idx}C`],
      forenames: "Bichard Test User",
      surname: `0${idx}`,
      email: `bichard0${idx}@example.com`,
      password: hashedPassword
    }
  })

  beforeEach(() => {
    cy.task("clearUsers")
  })

  it("should return 401 when there is no user within the database ", async () => {
    cy.task("insertUsers", { users: defaultUsers, userGroups: ["B7NewUI_grp"] })
    loginAndGoToUrl()
    cy.task("clearUsers")
    cy.request({
      failOnStatusCode: false,
      url: "/bichard"
    }).then((response) => {
      expect(response.status).to.eq(401)
    })
  })
})
