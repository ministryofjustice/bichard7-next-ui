describe("Home", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.task("clearUsers")
      cy.viewport(1280, 720)
    })

    context("top-nav", () => {
      it("should link to other pages", () => {
        cy.task("insertUsers", [
          {
            username: `Bichard01`,
            visibleForces: [`01`],
            forenames: "Bichard Test User",
            surname: `01`,
            email: `bichard01@example.com`,
            password:
              "$argon2id$v=19$m=256,t=20,p=2$TTFCN3BRcldZVUtGejQ3WE45TGFqPT0$WOE+jDILDnVIAt1dytb+h65uegrMomp2xb0Q6TxbkLA"
          }
        ])
        cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7NewUI_grp" })
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.contains("nav a", "Case List").should("have.attr", "href", "/bichard/")
        cy.contains("nav a", "Help").should("have.attr", "href", "/help/")
        cy.contains("nav a", "Reports").should("have.attr", "href", "/bichard-ui/ReturnToReportIndex")
      })
    })
  })
})

export {}
