import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { UpdatedCourtOffenceSequenceNumber } from "types/Amendments"

const amendCourtOffenceSequenceNumber = (
  offences: UpdatedCourtOffenceSequenceNumber[],
  aho: AnnotatedHearingOutcome
) => {
  offences.forEach(({ offenceIndex, updatedValue }: UpdatedCourtOffenceSequenceNumber) => {
    const defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
    const offenceIndexOutOfRange = offenceIndex > defendant.Offence.length - 1
    if (offenceIndexOutOfRange) {
      throw new Error(`Cannot update the CourtOffenceSequenceNumber; Offence index is out of range`)
    }

    defendant.Offence[offenceIndex].CourtOffenceSequenceNumber = updatedValue
    return
  })
}

export default amendCourtOffenceSequenceNumber
