import { loginAndVisit } from "../../../support/helpers"
import HO100310 from "./fixtures/HO100310.json"

describe("Offence matching HO100310", () => {
  const fields = {
    defendantName: "Offence Matching HO100310",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100310,
    errorCount: 2
  }

  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [fields])

    loginAndVisit()
    cy.get("a[class*='Link']").contains(fields.defendantName).click()
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
  })

  it("displays the offence matcher for offences with a HO100310 exception", () => {
    cy.get("#offences").contains("Theft of pedal cycle").click()
    cy.get("select.offence-matcher").should("exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 2 of 5")
    cy.get("select.offence-matcher").should("not.exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 3 of 5")
    cy.get("select.offence-matcher").should("not.exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 4 of 5")
    cy.get("select.offence-matcher").should("exist")

    cy.get("button").contains("Next offence").click()
    cy.contains("Offence 5 of 5")
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("loads offence matching information from the AHO PNC query", () => {
    cy.get("#offences").contains("Theft of pedal cycle").click()

    cy.get("select.offence-matcher").children("optgroup").eq(0).should("have.attr", "label", "97/1626/008395Q")
    cy.get("select.offence-matcher").children("optgroup").eq(0).contains("option", "TH68006")
  })

  it("disables options that have already been selected", () => {
    cy.get("#offences").contains("Theft of pedal cycle").click()
    cy.get("select.offence-matcher").select("001 - TH68006")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select").contains("option", "TH68006").should("be.disabled").and("not.be.selected")
  })

  it("all offences should have a matching option selected before case can be submitted", () => {
    cy.get("button#submit").should("be.disabled")

    cy.get("#offences").contains("Theft of pedal cycle").click()
    cy.get("select.offence-matcher").select("001 - TH68006")

    cy.get("a").contains("Back to all offences").click()
    cy.get("a:contains('Theft of pedal cycle')").eq(1).click()
    cy.get("select.offence-matcher").select("Added in court")

    cy.get("button#submit").should("be.enabled")
  })

  it.skip("sends correct offence matching amendments on submission")
  it.skip("displays correct badges for offences on submitted cases")
})
