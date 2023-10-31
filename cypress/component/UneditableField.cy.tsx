import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

describe("Uneditable fields", () => {
  ;[
    {
      title: "Disposal Qualifier code",
      exception: ExceptionCode.HO100309,
      message:
        "This code could not be recognised, contact the courts to verify the correct information and report to the Bichard 7 team. Resolve exception by manually updating the PNC with correct code.",
      code: "XX"
    }
  ].forEach(({ title, exception, message, code }) => {
    it(`should show the error prompt for exception ${exception} - ${title}`, () => {
      cy.mount(<UneditableField code={code} message={message} />)
      cy.get(".qualifier-code").should("have.text", code)
      cy.get("moj-badge--purple").should("have.text", "SYSTEM ERROR")
      cy.get("qualifier-code-body").should("have.text", message)
    })
  })
})
