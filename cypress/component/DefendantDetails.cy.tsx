import { HearingDefendant } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
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
  })
})
