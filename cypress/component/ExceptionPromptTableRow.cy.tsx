import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import ExceptionPromptTableRow from "../../src/components/ExceptionPromptTableRow"
import ErrorMessage from "../../src/types/ErrorMessages"

describe("Uneditable Fields", () => {
  ;[
    {
      title: "Disposal Qualifier",
      label: "Code",
      exception: ExceptionCode.HO100309,
      badge: "SYSTEM ERROR",
      message: ErrorMessage.QualifierCode,
      value: "XX"
    }
  ].forEach(({ title, exception, badge, message, value, label }) => {
    it(`should show an error prompt for exception ${exception} (${title})`, () => {
      cy.mount(
        <ExceptionPromptTableRow
          badgeText={badge}
          message={message}
          value={value}
          label={label}
          badgeColour={"purple"}
        />
      )
      cy.get(".field-value").should("have.text", value)
      cy.get(".error-prompt-badge").should("have.text", badge)
      cy.get(".error-prompt-message").should("have.text", message)
    })
  })
})
