import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import convertAsnToLongFormat from "@moj-bichard7-developers/bichard7-next-core/core/phase1/enrichAho/enrichFunctions/enrichDefendant/convertAsnToLongFormat"

const amendAsn = (newAsn: string, aho: AnnotatedHearingOutcome) => {
  const fullAsn = convertAsnToLongFormat(newAsn)
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = fullAsn
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach(
    (offence) =>
      (offence.CriminalProsecutionReference.DefendantOrOffender.DefendantOrOffenderSequenceNumber =
        fullAsn.length === 21 ? fullAsn.substring(9, 20) : fullAsn.substring(8, 19))
  )
}

export default amendAsn
