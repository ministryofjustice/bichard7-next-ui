import User from "services/entities/User"
import type CaseDetailsTab from "../../../src/types/CaseDetailsTab"
import hashedPassword from "../../fixtures/hashedPassword"

const clickTab = (tab: CaseDetailsTab) => {
  cy.contains(tab).click()
  cy.get("H3").contains(tab)
}

describe("Court case details", () => {
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

  before(() => {
    cy.task("clearCourtCases")
    cy.task("clearUsers")
    cy.task("insertUsers", { users, userGroups: ["B7NewUI_grp"] })
    cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7TriggerHandler_grp" })
    cy.task("insertIntoUserGroup", { emailAddress: "bichard02@example.com", groupName: "B7Supervisor_grp" })
    cy.clearCookies()
    cy.viewport(1800, 720)
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("should display all notes by default", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          {
            user: "bichard01",
            text: "Test note 1"
          },
          {
            user: "System",
            text: "Test note 2"
          }
        ]
      ],
      force: "02"
    })
    cy.login("bichard02@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    clickTab("Notes")

    cy.contains("bichard01")
    cy.contains("Test note 1")
    cy.contains("System")
    cy.contains("Test note 2")
  })

  it("should display system and user notes", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          {
            user: "bichard01",
            text: "Test note 1"
          },
          {
            user: "System",
            text: "Test note 2"
          }
        ]
      ],
      force: "02"
    })
    cy.login("bichard02@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    clickTab("Notes")

    cy.findByText("View system notes").click()
    cy.should("not.contain", "bichard01")
    cy.should("not.contain", "Test note 1")
    cy.contains("System")
    cy.contains("Test note 2")

    cy.findByText("View user notes").click()
    cy.should("not.contain", "System")
    cy.should("not.contain", "Test note 2")
    cy.contains("bichard01")
    cy.contains("Test note 1")
    cy.get("#reallocate").should("not.exist")
    cy.get("#resolve").should("not.exist")
  })

  it("should display no user notes message", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          {
            user: "System",
            text: "Test note 2"
          }
        ]
      ],
      force: "02"
    })
    cy.login("bichard02@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    clickTab("Notes")
    cy.findByText("View user notes").click()

    cy.should("not.contain", "System")
    cy.should("not.contain", "Test note 2")
    cy.contains("Case has no user notes.")
  })

  it("should display no system notes message", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          {
            user: "bichard01",
            text: "Test note 1"
          }
        ]
      ],
      force: "02"
    })
    cy.login("bichard02@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    clickTab("Notes")
    cy.findByText("View system notes").click()

    cy.should("not.contain", "bichard01")
    cy.should("not.contain", "Test note 1")
    cy.contains("Case has no system notes.")
  })

  it("should display no notes message", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [[]],
      force: "02"
    })
    cy.login("bichard02@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    clickTab("Notes")
    cy.contains("Case has no notes.")
  })

  it("should not display the notes text area if the case is locked to another users", () => {
    cy.task("insertCourtCasesWithNotesAndLock", {
      caseNotes: [[]],
      force: "02"
    })
    cy.login("bichard02@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    clickTab("Notes")
    cy.contains("Case has no notes.")
  })

  it("should display the notes text area if the case is not locked to another users", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [[]],
      force: "02"
    })
    cy.login("bichard02@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    clickTab("Notes")
    cy.get("h3").contains("Add a new note")
    cy.get("p").contains("You have 2000 characters remaining")
  })
})

export {}
