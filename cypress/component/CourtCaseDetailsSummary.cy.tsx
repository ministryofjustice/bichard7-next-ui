import CourtCaseDetailsSummaryBox from "../../src/features/CourtCaseDetails/CourtCaseDetailsSummaryBox"

describe("Court Case Details Summary Box", () => {
  it("diplays the required fields", () => {
    cy.mount(
      <CourtCaseDetailsSummaryBox
        asn="asn-value"
        courtCode="courtCode-value"
        courtName="courtName-value"
        courtReference={"courtReference-value"}
        pnci="pnci-value"
        ptiurn="ptirn-value"
        dob={new Date("10/3/2004").toDateString()}
        hearingDate={new Date("04/25/2001").toDateString()}
      />
    )

    cy.contains("ASN")
    cy.contains("asn-value")

    cy.contains("Court code (LJA)")
    cy.contains("ourtCode-value")

    cy.contains("Court name")
    cy.contains("courtName-value")

    cy.contains("Court name")
    cy.contains("courtName-value")

    cy.contains("Court case reference")
    cy.contains("courtReference-value")

    cy.contains("PNCID")
    cy.contains("pnci-value")

    cy.contains("PTIURN")
    cy.contains("ptirn-value")

    cy.contains("DOB")
    cy.contains("03/10/2004")

    cy.contains("Hearing date")
    cy.contains("25/04/2001")
  })
})
