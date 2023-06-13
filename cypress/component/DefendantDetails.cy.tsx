import { HearingDefendant } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { format } from "date-fns"
import { DefendantDetails } from "../../src/features/CourtCaseDetails/Tabs/Panels/DefendantDetails"

describe("Defendant Details", () => {
  it("displays all defendant details", () => {
    const dob = new Date()
    const data: Partial<HearingDefendant> = {
      PNCCheckname: "PNCCheckName",
      Address: {
        AddressLine1: "AddressLine1",
        AddressLine2: "AddressLine2",
        AddressLine3: "AddressLine3",
        AddressLine4: "AddressLine4",
        AddressLine5: "AddressLine5"
      },
      RemandStatus: "UB",
      DefendantDetail: {
        GeneratedPNCFilename: "FirstName/LastName",
        BirthDate: dob,
        PersonName: {
          GivenName: ["GivenName"],
          Title: "Title",
          FamilyName: "FamilyName"
        },
        Gender: 1
      }
    }
    cy.mount(<DefendantDetails defendant={data as HearingDefendant} />)

    cy.get("#table-row-pnc-check-name")
      .should("include.text", "PNC Check name")
      .should("include.text", data.PNCCheckname)
    cy.get("#table-row-given-name")
      .should("include.text", "Given name")
      .should("include.text", data.DefendantDetail?.PersonName.GivenName)
    cy.get("#table-row-family-name")
      .should("include.text", "Family name")
      .should("include.text", data.DefendantDetail?.PersonName.FamilyName)
    cy.get("#table-row-title")
      .should("include.text", "Title")
      .should("include.text", data.DefendantDetail?.PersonName.Title)
    cy.get("#table-row-date-of-birth")
      .should("include.text", "Date of birth")
      .should("include.text", format(data.DefendantDetail?.BirthDate as Date, "dd/MM/yyyy"))
    cy.get("#table-row-gender").should("include.text", "Gender").should("include.text", "1(male)")
    cy.get("#table-row-address")
      .should("include.text", "Address")
      .should("include.text", data.Address?.AddressLine1)
      .should("include.text", data.Address?.AddressLine2)
      .should("include.text", data.Address?.AddressLine3)
      .should("include.text", data.Address?.AddressLine4)
      .should("include.text", data.Address?.AddressLine5)
    cy.get("#table-row-pnc-file-name")
      .should("include.text", "PNC file name")
      .should("include.text", data.DefendantDetail?.GeneratedPNCFilename)
    cy.get("#table-row-remand-status")
      .should("include.text", "Remand status")
      .should("include.text", "Unconditional bail")
  })
})
