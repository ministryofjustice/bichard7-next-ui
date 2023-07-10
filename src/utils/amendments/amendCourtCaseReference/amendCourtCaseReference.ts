import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import { UpdatedOffenceValue } from "types/Amendments"

const amendCourtCaseReference = (updatedOffenceValue: UpdatedOffenceValue[], aho: AnnotatedHearingOutcome) => {
  updatedOffenceValue.forEach(({ offenceIndex, updatedValue }: UpdatedOffenceValue) => {
    if (updatedValue.length === 0) {
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].CourtCaseReferenceNumber =
        null
      return
    }
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].CourtCaseReferenceNumber =
      updatedValue

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualCourtCaseReference =
      true
  })
}

export default amendCourtCaseReference
