import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import createDummyOffence from "./createDummyOffence"
import createDummyResult from "./createDummyResult"

const createDummyAho = (): AnnotatedHearingOutcome => {
  return {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          PTIURN: "123456",
          PreChargeDecisionIndicator: false,
          HearingDefendant: {
            ArrestSummonsNumber: "original_value",
            Offence: [createDummyOffence()],
            Result: createDummyResult(),
            Address: {
              AddressLine1: "somewhere"
            },
            RemandStatus: "some_status",
            BailConditions: []
          },
          CourtReference: {
            MagistratesCourtReference: "random_magristrates_ref",
            CrownCourtReference: "random_crown_ref"
          }
        },
        Hearing: {
          CourtHearingLocation: {
            TopLevelCode: "01",
            SecondLevelCode: "23",
            ThirdLevelCode: "45",
            BottomLevelCode: "67",
            OrganisationUnitCode: "01234567"
          },
          DateOfHearing: new Date(),
          TimeOfHearing: "0900",
          HearingLanguage: "english",
          HearingDocumentationLanguage: "english",
          DefendantPresentAtHearing: "y",
          SourceReference: {
            DocumentName: "example",
            UniqueID: "9999999",
            DocumentType: "document"
          },
          CourtHouseCode: 123
        }
      }
    }
  }
}

export default createDummyAho
