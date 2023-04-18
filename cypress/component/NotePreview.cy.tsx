import Note from "services/entities/Note"
import { HideButton, PreviewButton, NotePreview } from "../../src/features/CourtCaseList/NotePreviewButton"

describe("NotePreviewButton", () => {
  it("shows the default down chevron with the label 'preview'", () => {
    cy.mount(<PreviewButton />)
    cy.get(".govuk-accordion-nav__chevron--down").should("exist")
    cy.get(".govuk-accordion-nav__chevron").should("exist")
  })

  it("shows the default up chevron with the label 'hide'", () => {
    cy.mount(<HideButton />)
    cy.get(".govuk-accordion-nav__chevron").should("exist")
  })
})

describe("NotePreview", () => {
  it("should show the full text when note length is 100 characters", () => {
    const note = {
      noteText: "a".repeat(100),
      createdAt: new Date()
    } as Note
    cy.mount(<NotePreview latestNote={note} numberOfNotes={10} />)
    cy.get("div > p:nth-child(2)").should("have.text", note.noteText)
  })

  it("should show the full text when note length is less than 100 characters", () => {
    const note = {
      noteText: "a".repeat(90),
      createdAt: new Date()
    } as Note
    cy.mount(<NotePreview latestNote={note} numberOfNotes={10} />)
    cy.get("div > p:nth-child(2)").should("have.text", note.noteText)
  })

  it("should truncate text when note length is more than 100 characters", () => {
    const note = {
      noteText: "a".repeat(110),
      createdAt: new Date()
    } as Note
    const expectedNoteText = "a".repeat(100) + "..."
    cy.mount(<NotePreview latestNote={note} numberOfNotes={10} />)
    cy.get("div > p:nth-child(2)").should("have.text", expectedNoteText)
  })
})
