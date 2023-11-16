import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import UneditableField from "../../src/components/UneditableField"
import ErrorMessage from "../../src/types/ErrorMessages"

describe("Uneditable Fields", () => {
  ;[
    {
      title: "Disposal Qualifier",
      label: "Code",
      exception: ExceptionCode.HO100309,
      badge: "SYSTEM ERROR",
      message: ErrorMessage.QualifierCode,
      code: "XX"
    },
    {
      title: "ASN",
      label: "ASN",
      exception: ExceptionCode.HO200113,
      badge: "SYSTEM ERROR",
      message: ErrorMessage.AsnUneditable,
      code: "2300000000000942133G"
    },
    {
      title: "ASN",
      label: "ASN",
      exception: ExceptionCode.HO200114,
      badge: "SYSTEM ERROR",
      message: ErrorMessage.AsnUneditable,
      code: "2200000000001145631B"
    }
  ].forEach(({ title, exception, badge, message, code, label }) => {
    it(`should show an error prompt for exception ${exception} (${title})`, () => {
      cy.mount(<UneditableField badge={badge} message={message} code={code} label={label} colour={"purple"} />)
      cy.get(".qualifier-code").should("have.text", code)
      cy.get(".error-prompt-badge").should("have.text", badge)
      cy.get(".error-prompt-message").should("have.text", message)
    })
  })
})
