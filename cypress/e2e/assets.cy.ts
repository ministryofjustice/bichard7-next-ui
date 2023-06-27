import hashedPassword from "../fixtures/hashedPassword"

describe("GOV.UK Assets", () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.task("clearCourtCases")
    cy.task("clearUsers")

    cy.task("insertUsers", {
      users: [
        {
          username: "Bichard01",
          visibleForces: ["01"],
          forenames: "Bichard Test User",
          surname: "01",
          email: "bichard01@example.com",
          password: hashedPassword
        }
      ],
      userGroups: ["B7NewUI_grp"]
    })
    cy.login("bichard01@example.com", "password")
  })

  it("Should provide copyright logo", () => {
    cy.visit("/bichard")
    cy.get(
      "a[href='https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/']"
    )
      .should("be.visible")
      .should("have.attr", "image", "[object Object]")
  })

  it("Should provide favicon icon that loads correctly", () => {
    cy.visit("/bichard")
    cy.get("link[rel='shortcut icon']")
      .should("have.attr", "href")
      .then((iconHref) => {
        const iconUrl = iconHref as unknown as string
        cy.request({
          url: iconUrl,
          failOnStatusCode: false
        }).then((resp) => {
          expect(resp.status).not.to.equal(404)
          expect(resp.status).to.equal(200)
          expect(resp.body).not.to.equal(undefined)
        })
      })
  })
})

export {}
