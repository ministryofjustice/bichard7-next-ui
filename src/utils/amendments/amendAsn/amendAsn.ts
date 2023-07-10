import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import convertAsnToLongFormat from "@moj-bichard7-developers/bichard7-next-core/dist/enrichAho/enrichFunctions/enrichDefendant/convertAsnToLongFormat"

const amendAsn = (newAsn: string, aho: AnnotatedHearingOutcome) => {
  if (newAsn.length < 19) {
    throw new Error(`invalid length for asn, the asn needs a minimum length of 18 but has ${newAsn.length}`)
  }
  const fullAsn = convertAsnToLongFormat(newAsn)
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = fullAsn
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach(
    (offence) =>
      (offence.CriminalProsecutionReference.DefendantOrOffender.DefendantOrOffenderSequenceNumber =
        fullAsn.length === 21 ? fullAsn.substring(9, 20) : fullAsn.substring(8, 19))
  )
}

export default amendAsn
