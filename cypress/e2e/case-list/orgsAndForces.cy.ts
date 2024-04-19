import { confirmMultipleFieldsDisplayed, confirmMultipleFieldsNotDisplayed, loginAndVisit } from "../../support/helpers"

describe("How orgs and forces are presented", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should display a case for the user's org", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    loginAndVisit()

    cy.get("tr").not(":first").get("td:nth-child(5)").contains(`Case00000`)
  })

  it("Should only display cases that are in to users visible forces or visible courts", () => {
    const visibleForceCode = "02"
    const visibleCourtCode = "2C"
    const caseNotVisible = "NV01"
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: visibleForceCode, ptiurn: "expected1" },
      { orgForPoliceFilter: visibleForceCode, ptiurn: "expected2" },
      { courtCode: visibleCourtCode, ptiurn: "expected3" },
      { orgForPoliceFilter: caseNotVisible, ptiurn: "NotExpected" }
    ])

    loginAndVisit("BichardForce02")

    confirmMultipleFieldsDisplayed(["expected1", "expected2", "expected3"])
    confirmMultipleFieldsNotDisplayed(["NotExpected"])
  })

  // Old Bichard generates an inclusion list from visible courts and visible forces
  // and checks all of the codes against both court codes and org police filter
  it("Should display a case that has orgForPoliceFilter that matches the users' visible courts", () => {
    const code = "02"
    const caseNotVisible = "NV01"
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: code, ptiurn: "expected" },
      { orgForPoliceFilter: caseNotVisible, ptiurn: "NotExpected" }
    ])

    loginAndVisit("BichardForce02")

    confirmMultipleFieldsDisplayed(["expected"])
    confirmMultipleFieldsNotDisplayed(["NotExpected"])
  })

  it("Should display a case that has court code that matches the users' visible forces", () => {
    const code = "002"
    const caseNotVisible = "NV01"
    cy.task("insertCourtCasesWithFields", [
      { courtCode: code, ptiurn: "expected" },
      { courtCode: caseNotVisible, ptiurn: "NotExpected" }
    ])

    loginAndVisit("BichardForce02")

    confirmMultipleFieldsDisplayed(["expected"])
    confirmMultipleFieldsNotDisplayed(["NotExpected"])
  })

  it("Should display cases for sub-forces", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "01" },
      { orgForPoliceFilter: "011" },
      { orgForPoliceFilter: "012A" },
      { orgForPoliceFilter: "013A1" }
    ])

    loginAndVisit()

    cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00000")
    cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00001")
    cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00002")
    cy.get("tr").not(":first").get("td:nth-child(5)").contains("Case00003")
  })
})
