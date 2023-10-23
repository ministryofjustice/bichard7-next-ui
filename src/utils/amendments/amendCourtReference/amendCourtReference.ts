import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

const amendCourtReference = (updatedValue: string, aho: AnnotatedHearingOutcome) => {
  const courtReference = aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference
  if (!courtReference.MagistratesCourtReference && !courtReference.CrownCourtReference) {
    throw new Error("Cannot set CourtReference since unable to distinguish between Magistrates and Crown Court")
  }

  if (courtReference.MagistratesCourtReference) {
    courtReference.MagistratesCourtReference = updatedValue
  }

  if (courtReference.CrownCourtReference) {
    courtReference.CrownCourtReference = updatedValue
  }
}

export default amendCourtReference
