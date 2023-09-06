describe("Pagination of caselist", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.login("bichard01@example.com", "password")
    // insert dummy data to the database
  })
  it("Should redirect to last possible page when the number of cases is equal to or less than filtered numbers of cases ", () => {
    cy.visit("/bichard")
    // go to last page
    cy.get("").click() // TODO: get filter dropdown
    // navigate to page 1 and expect ???
  })
})
