import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { UpdatedNextHearingDate, ValidProperties } from "types/Amendments"
import amendDefendantOrOffenceResult from "../amendDefendantOrOffenceResult"

const amendNextHearingDate = (offences: UpdatedNextHearingDate[], aho: AnnotatedHearingOutcome) =>
  offences.forEach(({ offenceIndex, resultIndex, updatedValue }: UpdatedNextHearingDate) =>
    amendDefendantOrOffenceResult({ offenceIndex, resultIndex }, aho, ValidProperties.NextHearingDate, updatedValue)
  )

export default amendNextHearingDate
