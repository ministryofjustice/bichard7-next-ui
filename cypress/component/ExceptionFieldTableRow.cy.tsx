import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import ErrorMessage from "../../src/types/ErrorMessages"
import ExceptionFieldTableRow from "../../src/components/ExceptionFieldTableRow"
import ErrorPromptMessage from "../../src/components/ErrorPromptMessage"

describe("Uneditable Fields", () => {
  ;[
    {
      title: "Disposal Qualifier",
      label: "Code",
      exception: ExceptionCode.HO100309,
      badge: "SYSTEM ERROR",
      message: ErrorMessage.QualifierCode,
      value: "XX"
    },
    {
      title: "ASN",
      label: "ASN",
      exception: ExceptionCode.HO200113,
      badge: "SYSTEM ERROR",
      message: ErrorMessage.HO200113,
      value: "2300000000000942133G"
    },
    {
      title: "ASN",
      label: "ASN",
      exception: ExceptionCode.HO200114,
      badge: "SYSTEM ERROR",
      message: ErrorMessage.HO200114,
      value: "2200000000001145631B"
    }
  ].forEach(({ title, exception, badge, message, value, label }) => {
    it(`should show an error prompt for exception ${exception} (${title})`, () => {
      cy.mount(
        <ExceptionFieldTableRow badgeText={badge} value={value} label={label} badgeColour={"purple"}>
          <ErrorPromptMessage message={message} />
        </ExceptionFieldTableRow>
      )
      cy.get(".field-value").should("have.text", value)
      cy.get(".error-badge").should("have.text", badge)
      cy.get('[class*="errorPromptMessage"]').should("have.text", message)
    })
  })
})
