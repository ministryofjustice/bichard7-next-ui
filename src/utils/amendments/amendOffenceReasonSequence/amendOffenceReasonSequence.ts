import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { UpdatedOffenceValue } from "types/Amendments"

const amendOffenceReasonSequence = (newOffenceReasonSequence: UpdatedOffenceValue[], aho: AnnotatedHearingOutcome) => {
  newOffenceReasonSequence.forEach((offence: UpdatedOffenceValue) => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
      offence.offenceIndex
    ].CriminalProsecutionReference.OffenceReasonSequence = offence.updatedValue

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
      offence.offenceIndex
    ].ManualSequenceNumber = true
  })
}

export default amendOffenceReasonSequence
