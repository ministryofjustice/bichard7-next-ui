import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { UpdatedOffenceValue } from "types/Amendments"

const amendCourtCaseReference = (updatedOffenceValue: UpdatedOffenceValue[], aho: AnnotatedHearingOutcome) => {
  updatedOffenceValue.forEach((offence: UpdatedOffenceValue) => {
    if (offence.updatedValue.length === 0) {
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
        offence.offenceIndex
      ].CourtCaseReferenceNumber = null
      return
    }
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
      offence.offenceIndex
    ].CourtCaseReferenceNumber = offence.updatedValue

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
      offence.offenceIndex
    ].ManualCourtCaseReference = true
  })
}

export default amendCourtCaseReference
