/* eslint-disable cypress/no-async-tests */
import { HideButton, PreviewButton } from "../../src/features/CourtCaseList/NotePreviewButton"
describe("chevron icons check", () => {
  it("shows the default down chevron with the label 'preview'", () => {
    cy.mount(<PreviewButton />)
    cy.get(".govuk-accordion-nav__chevron--down").should("exist")
  })

  it("shows the default up chevron with the label 'hide'", () => {
    cy.mount(<HideButton />)
    cy.get(".govuk-accordion-nav__chevron").should("exist")
  })
})
