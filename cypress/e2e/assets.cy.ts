describe("GOV.UK Assets", () => {
  it("should provide copyright logo", () => {
    cy.setAuthCookie("Bichard01")
    cy.visit("/")
    cy.get(
      "a[href='https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/']"
    )
      .should("be.visible")
      .should("have.attr", "image", "[object Object]")
  })

  it("should provide favicon icon that loads correctly", () => {
    cy.setAuthCookie("Bichard01")
    cy.get("link[rel='shortcut icon']")
      .should("have.attr", "href")
      .then((iconHref) => {
        // cy.request automatically uses Cypress' defined baseUrl, which
        // includes /users already - so we need to strip it out here to get it
        // to work
        const iconUrl = (iconHref as unknown as string).replace("/bichard", "")
        cy.request({
          url: iconUrl,
          failOnStatusCode: false
        }).then((resp) => {
          expect(resp.status).not.to.equal(404)
          expect(resp.body).not.to.equal(undefined)
        })
      })
  })
})

export {}
