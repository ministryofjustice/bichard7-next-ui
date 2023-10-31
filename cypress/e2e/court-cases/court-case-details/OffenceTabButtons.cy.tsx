import hashedPassword from "../../../fixtures/hashedPassword"

describe("“next offence” and “previous offence” buttons", () => {
  before(() => {
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
      userGroups: ["B7NewUI_grp", "B7GeneralHandler_grp"]
    })
  })

  beforeEach(() => {
    cy.login("bichard01@example.com", "password")
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
  })
  it("Should show next offence when next button is clicked if its not the last offence", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 1, force: "01" })
    cy.visit("/bichard/court-cases/0")
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get("tbody tr:first-child a.govuk-link").click()
    cy.get("button").contains("Next offence").click()
    cy.get("h3").should("include.text", "Offence 2 of 3")
    cy.get("button").contains("Next offence").click()
    cy.get("h3").should("include.text", "Offence 3 of 3")
    cy.get("button").should("not.contain.text", "Next offence")
  })

  it("Should show previous offence when previous button is clicked if its not the first offence", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 1, force: "01" })
    cy.visit("/bichard/court-cases/0")
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get("tbody tr:first-child a.govuk-link").click()
    cy.get("button").should("not.contain.text", "Previous offence")
    cy.get("button").contains("Next offence").click()
    cy.get("button").contains("Next offence").click()
    cy.get("button").contains("Previous offence").click()
    cy.get("h3").should("include.text", "Offence 2 of 3")
  })

  it("Should show not show any buttons when there is only one offence", () => {
    cy.task("insertCourtCaseWithMultipleOffences", { case: { orgForPoliceFilter: "01" }, offenceCount: 1 })
    cy.visit("/bichard/court-cases/0")
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get("tbody tr:first-child a.govuk-link").click()
    cy.get("button").should("not.contain.text", "Previous offence")
    cy.get("button").should("not.contain.text", "Next offence")
  })
})
