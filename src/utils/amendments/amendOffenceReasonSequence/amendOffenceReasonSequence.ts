import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { UpdatedOffenceValue } from "types/Amendments"

const amendOffenceReasonSequence = (newOffenceReasonSequence: UpdatedOffenceValue, aho: AnnotatedHearingOutcome) => {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
    newOffenceReasonSequence.offenceIndex
  ].CriminalProsecutionReference.OffenceReasonSequence = newOffenceReasonSequence.updatedValue

  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
    newOffenceReasonSequence.offenceIndex
  ].ManualSequenceNumber = true
}

export default amendOffenceReasonSequence
