import hashedPassword from "../fixtures/hashedPassword"

describe("General Feedback Form", () => {
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

  it("Should be able to visit feedback page from the caselist", () => {
    cy.visit("/bichard")
    cy.findByText("feedback").click()
    cy.get("h2").contains("Share your feedback").should("exist")
    // Confirm we land on feedback page
    // submit a new feedback
    // - select how satisfied
    // - fill in description box
    // submit
    // expect to return to previous page
  })
})

export {}
