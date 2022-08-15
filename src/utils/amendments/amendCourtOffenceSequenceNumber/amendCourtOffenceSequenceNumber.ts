import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { UpdatedCourtOffenceSequenceNumber } from "types/Amendments"

const amendCourtOffenceSequenceNumber = (
  { offenceIndex, updatedValue }: UpdatedCourtOffenceSequenceNumber,
  aho: AnnotatedHearingOutcome
) => {
  const defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const offenceIndexOutOfRange = offenceIndex > defendant.Offence.length - 1
  if (offenceIndexOutOfRange) {
    throw new Error(`Cannot update the CourtOffenceSequenceNumber; Offence index is out of range`)
  }

  defendant.Offence[offenceIndex].CourtOffenceSequenceNumber = updatedValue
  return
}

export default amendCourtOffenceSequenceNumber
