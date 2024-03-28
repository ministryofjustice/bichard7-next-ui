import User from "../../../../src/services/entities/User"
import OrganisationUnitApiResponse from "../../../../src/types/OrganisationUnitApiResponse"
import hashedPassword from "../../../fixtures/hashedPassword"

describe("Organiation Units API endpoint", () => {
  before(() => {
    cy.task("clearUsers")
    cy.task("insertUsers", {
      users: [
        {
          username: "Bichard01",
          visibleForces: [1],
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

  it("returns a list of organisations that matches the search keyword", () => {
    cy.login("bichard01@example.com", "password")

    const searchKeyword = "croydon"
    cy.request({
      method: "GET",
      url: `/bichard/api/organisation-units?search=${searchKeyword}`
    }).then((response) => {
      expect(response.status).to.eq(200)

      const organisationUnitsResponse = response.body as OrganisationUnitApiResponse
      expect(organisationUnitsResponse).to.have.length(3)
      expect(organisationUnitsResponse[0].fullOrganisationName).to.equal("Crown Courts London Croydon")
      expect(organisationUnitsResponse[1].fullOrganisationName).to.equal("Magistrates' Courts London Croydon")
      expect(organisationUnitsResponse[2].fullOrganisationName).to.equal("Crown Courts London Jury's Inn Croydon")
    })
  })

  it("returns one item in a list for when search keyword is an exact match", () => {
    cy.login("bichard01@example.com", "password")

    const searchKeyword = "B01EF00"
    cy.request({
      method: "GET",
      url: `/bichard/api/organisation-units?search=${searchKeyword}`
    }).then((response) => {
      expect(response.status).to.eq(200)

      const organisationUnitsResponse = response.body as OrganisationUnitApiResponse
      expect(organisationUnitsResponse).to.have.length(1)
      expect(organisationUnitsResponse[0].fullOrganisationName).to.equal("Magistrates' Courts London Croydon")
    })
  })
})
