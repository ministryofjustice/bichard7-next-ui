import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import createDummyResult from "./createDummyResult"

const createDummyOffence = (): Offence =>
  ({
    CriminalProsecutionReference: {
      DefendantOrOffender: {
        DefendantOrOffenderSequenceNumber: "0000"
      },
      OffenceReasonSequence: "0000"
    },

    Result: [createDummyResult()]
  } as Offence)

export default createDummyOffence
