import { DisplayNote } from "types/display/Notes"
import { NotesTable } from "../../src/components/NotesTable"

describe("NotesTable", () => {
  it("displays provided notes", () => {
    const date1 = new Date()
    const date2 = new Date(date1.getTime() + 1000 * 60 * 60 * 24)
    const notes: DisplayNote[] = [
      {
        userFullName: "note user 1",
        userId: "1",
        noteText: "this is a note",
        createdAt: date1.toISOString()
      },
      {
        userFullName: "note user 2",
        userId: "1",
        noteText: "this is a different note",
        createdAt: date2.toISOString()
      }
    ]

    cy.mount(<NotesTable notes={notes} />)

    cy.contains("note user 1")
    cy.contains("this is a note")
    cy.contains(date1.toLocaleDateString())
    cy.contains(date1.toLocaleTimeString())

    cy.contains("note user 2")
    cy.contains("this is a different note")
    cy.contains(date2.toLocaleDateString())
    cy.contains(date2.toLocaleTimeString())
  })

  it("displays up to three user force codes", () => {
    const date1 = new Date()
    const date2 = new Date(date1.getTime() + 1000 * 60 * 60 * 24)
    const notes: DisplayNote[] = [
      {
        userFullName: "note user 1",
        userId: "1",
        noteText: "this is a note",
        user: { visibleForces: ["01"], username: "note.user1" },
        createdAt: date1.toISOString()
      },
      {
        userFullName: "note user 2",
        userId: "1",
        noteText: "this is a different note",
        user: { visibleForces: ["01", "02", "03", "04"], username: "note.user2" },
        createdAt: date2.toISOString()
      }
    ]

    cy.mount(<NotesTable displayForce notes={notes} />)

    cy.contains("(01)")
    cy.contains("(01, 02, 03)")
  })
})
