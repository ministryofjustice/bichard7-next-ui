describe("reports API endpoint", () => {
  describe("GET /reports", () => {
    describe("without authentication", () => {
      it("returns a 401 status code", () => {
        cy.request({
          method: "GET",
          url: `/bichard/api/reports`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(401)
        })
      })
    })

    describe("with authentication", () => {
      beforeEach(() => {
        cy.loginAs("GeneralHandler")
      })

      it("returns a 200 status code", () => {
        cy.request({
          method: "GET",
          url: `/bichard/api/reports`
        }).then((response) => {
          expect(response.status).to.equal(200)
        })
      })
    })
  })
})
