describe("Home", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.clearCookies()
    })

    it("should display 0 cases and the user's username when no cases are added", () => {
      cy.setAuthCookie("Bichard01")
      cy.visit("/")
      cy.get("caption").should("have.text", "0 court cases for Bichard01")
    })

    it("should display a case for the user's org", () => {
      cy.setAuthCookie("Bichard01")
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      cy.visit("/")
      cy.get("caption").should("have.text", "1 court cases for Bichard01")
    })
  })
})

export {}
