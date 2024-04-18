import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Amendments } from "types/Amendments"

const amendOffenceReasonSequence = (
  newOffenceReasonSequence: Amendments["offenceReasonSequence"],
  aho: AnnotatedHearingOutcome
) => {
  newOffenceReasonSequence?.forEach(({ value, offenceIndex }) => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
      offenceIndex
    ].CriminalProsecutionReference.OffenceReasonSequence = String(value)

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualSequenceNumber = true
  })
}

export default amendOffenceReasonSequence
