import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { UpdatedOffenceValue } from "types/Amendments"

const amendCourtCaseReference = (updatedOffenceValue: UpdatedOffenceValue, aho: AnnotatedHearingOutcome) => {
  if (updatedOffenceValue.updatedValue.length === 0) {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
      updatedOffenceValue.offenceIndex
    ].CourtCaseReferenceNumber = null
    return
  }
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
    updatedOffenceValue.offenceIndex
  ].CourtCaseReferenceNumber = updatedOffenceValue.updatedValue

  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
    updatedOffenceValue.offenceIndex
  ].ManualCourtCaseReference = true
}

export default amendCourtCaseReference
