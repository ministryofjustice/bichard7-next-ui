import User from "services/entities/User"
import hashedPassword from "../../../fixtures/hashedPassword"

describe("Court cases - Submit exceptions", () => {
  const users: Partial<User>[] = Array.from(Array(5)).map((_value, idx) => {
    return {
      username: `Bichard0${idx}`,
      visibleForces: [`00${idx}`],
      forenames: "Bichard Test User",
      surname: `0${idx}`,
      email: `bichard0${idx}@example.com`,
      password: hashedPassword
    }
  })

  beforeEach(() => {
    cy.clearCookies()
    cy.task("clearCourtCases")
    cy.task("clearUsers")
    cy.task("insertUsers", { users, userGroups: ["B7NewUI_grp"] })
    cy.task("insertIntoUserGroup", { emailAddress: "bichard02@example.com", groupName: "B7Supervisor_grp" })
  })

  it("Should resubmit a case when edits are made and the submit button is clicked", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        errorCount: 1,
        orgForPoliceFilter: "02"
      }
    ])

    cy.login("bichard02@example.com", "password")

    cy.visit("/bichard/court-cases/0")

    cy.get("button.exception-location").contains("Offence 1").click()
    cy.get("input.govuk-input").first().type("2024-12-12")
    cy.get("button#submit").contains("Submit exception(s)").click()

    cy.url().should("match", /\/bichard\/court-cases\/0\/submit/)
    cy.get("#main-content").get(".moj-banner").should("not.exist")

    cy.get("p")
      .eq(1)
      .should(
        "have.text",
        "Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"
      )

    cy.get("button").contains("Submit exception(s)").click()
    cy.location().should((loc) => {
      expect(loc.href).to.contain("/bichard/court-cases/0")
    })

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    cy.contains("Bichard02: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2024-12-12")
    cy.contains("Bichard02: Portal Action: Resubmitted Message.")
  })

  it("Should resubmit a case when no updates made and the submit button is clicked", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        errorCount: 1,
        orgForPoliceFilter: "02"
      }
    ])

    cy.login("bichard02@example.com", "password")

    cy.visit("/bichard/court-cases/0")

    cy.get("button").contains("Submit exception(s)").click()

    cy.url().should("match", /\/bichard\/court-cases\/0\/submit/)
    cy.get("#main-content")
      .get(".moj-banner")
      .should("have.text", "The case exception(s) have not been updated within Bichard.")

    cy.get("p")
      .eq(1)
      .should("have.text", "Do you want to submit case details to the PNC and mark the exception(s) as resolved?")

    cy.get("button").contains("Submit exception(s)").click()
    cy.location().should((loc) => {
      expect(loc.href).to.contain("/bichard/court-cases/0")
    })

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    cy.contains(dateTimeRegex)
    cy.contains("Bichard02: Portal Action: Resubmitted Message.")
  })

  it("Should not resubmit a case when cancel button is clicked", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        errorCount: 1,
        orgForPoliceFilter: "02"
      }
    ])

    cy.login("bichard02@example.com", "password")
    cy.visit("/bichard/court-cases/0")
    cy.get("button").contains("Submit exception(s)").click()
    cy.url().should("match", /\/bichard\/court-cases\/0\/submit/)

    cy.get("a").contains("Cancel").click()
    cy.location().should((loc) => {
      expect(loc.href).to.contain("/bichard/court-cases/0")
    })

    cy.get("H1").should("have.text", "Case details")
    cy.contains("Notes").click()
    cy.get("form label").contains("Add a new note")

    cy.get("button").contains("Submit exception(s)")
  })
})
