import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { UpdatedOffenceValue } from "types/Amendments"

const amendOffenceReasonSequence = (newOffenceReasonSequence: UpdatedOffenceValue[], aho: AnnotatedHearingOutcome) => {
  newOffenceReasonSequence.forEach(({ updatedValue, offenceIndex }: UpdatedOffenceValue) => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
      offenceIndex
    ].CriminalProsecutionReference.OffenceReasonSequence = updatedValue

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualSequenceNumber = true
  })
}

export default amendOffenceReasonSequence
