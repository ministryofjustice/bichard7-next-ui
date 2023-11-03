import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import UneditableField from "../../src/components/UneditableField"

describe("Uneditable Fields", () => {
  ;[
    {
      title: "Disposal Qualifier",
      label: "Code",
      exception: ExceptionCode.HO100309,
      badge: "SYSTEM ERROR",
      message:
        "This code could not be recognised, contact the courts to verify the correct information and report to the Bichard 7 team. Resolve exception by manually updating the PNC with correct code.",
      code: "XX"
    }
  ].forEach(({ title, exception, badge, message, code, label }) => {
    it(`should show an error prompt for exception ${exception} (${title})`, () => {
      cy.mount(<UneditableField badge={badge} message={message} code={code} label={label} colour={"purple"} />)
      cy.get(".qualifier-code").should("have.text", code)
      cy.get(".badge").should("have.text", badge)
      cy.get(".message").should("have.text", message)
    })
  })
})
