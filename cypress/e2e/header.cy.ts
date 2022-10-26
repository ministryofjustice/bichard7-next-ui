import User from "services/entities/User"

describe("Home", () => {
  const hashedPassword =
    "$argon2id$v=19$m=256,t=20,p=2$TTFCN3BRcldZVUtGejQ3WE45TGFqPT0$WOE+jDILDnVIAt1dytb+h65uegrMomp2xb0Q6TxbkLA"

  context("720p resolution", () => {
    const users: Partial<User>[] = Array.from(Array(5)).map((_value, idx) => {
      return {
        username: `Bichard0${idx}`,
        visibleForces: [`0${idx}`],
        forenames: "Bichard Test User",
        surname: `0${idx}`,
        email: `bichard0${idx}@example.com`,
        password: hashedPassword
      }
    })

    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.task("clearUsers")
      cy.viewport(1280, 720)
    })

    context("top-nav", () => {
      it("should goto help page", () => {
        cy.task("insertUsers", users)
        cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7NewUI_grp" })
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.contains("nav a", "Help").should("have.attr", "href", "/help/")
      })
    })
  })
})

export {}
