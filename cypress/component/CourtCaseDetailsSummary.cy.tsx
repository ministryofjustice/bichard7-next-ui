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

    cy.contains("ASN asn-value")
    cy.contains("Court code (LJA) courtCode-value")
    cy.contains("Court name courtName-value")
    cy.contains("Court case reference courtReference-value")
    cy.contains("PNCID pnci-value")
    cy.contains("PTIURN ptirn-value")
    cy.contains("DOB 03/10/2004")
    cy.contains("Hearing date 25/04/2001")
  })
})
