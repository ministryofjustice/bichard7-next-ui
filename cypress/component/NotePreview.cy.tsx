/* eslint-disable cypress/no-async-tests */
import { PreviewNotes } from "../../src/features/CourtCaseList/tags/NotePreview"
import { DefaultUpChevron } from "../../src/components/icons/NotePreviewChevron"
describe("default chevrons", () => {
  it("shows the default down chevron with the label 'preview'", () => {
    cy.mount(<DefaultUpChevron />)
    cy.get(".defaultUpChevron").should("exist")
  })
  it("shows the default down chevron with the label 'preview'", () => {
    cy.mount(<PreviewNotes />)
    cy.get(".defaultUpChevron").should("exist")
  })

  //   it("shows the default up chevron with the label 'hide", () => {
  //     cy.mount(<NotePreview notes={[]} />)
  //     cy.get(".defaultDownChevron").should("exist")
  //   })
  // })
  // describe("hover chevrons", () => {
  //   it("shows the hover down chevron with the label 'preview", () => {
  //     cy.mount(<NotePreview notes={[]} />)
  //     cy.get(".hoverDownChevron").should("exist")
  //   })
  //   it("shows the hover up chevron with the label 'hide", () => {
  //     cy.mount(<NotePreview notes={[]} />)
  //     cy.get(".hoverUpChevron").should("exist")
  //   })
  // })

  // describe("active chevrons", () => {
  //   it("shows the active down chevron with the label 'preview", () => {
  //     cy.mount(<NotePreview notes={[]} />)
  //     cy.get(".activeDownChevron").should("exist")
  //   })
  //   it("shows the active up chevron with the label 'hide", () => {
  //     cy.mount(<NotePreview notes={[]} />)
  //     cy.get(".activeUpChevron").should("exist")
  //   })
})
