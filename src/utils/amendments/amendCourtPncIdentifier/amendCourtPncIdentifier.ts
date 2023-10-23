import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

const amendCourtPncIdentifier = (updatedValue: string, aho: AnnotatedHearingOutcome) =>
  (aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.CourtPNCIdentifier = updatedValue)

export default amendCourtPncIdentifier
