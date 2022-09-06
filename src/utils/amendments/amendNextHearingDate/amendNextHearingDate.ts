import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { UpdatedNextHearingDate, ValidProperties } from "types/Amendments"
import amendDefendantOrOffenceResult from "../amendDefendantOrOffenceResult"

const amendNextHearingDate = (
  { offenceIndex, resultIndex, updatedValue }: UpdatedNextHearingDate,
  aho: AnnotatedHearingOutcome
) => amendDefendantOrOffenceResult({ offenceIndex, resultIndex }, aho, ValidProperties.NextHearingDate, updatedValue)

export default amendNextHearingDate
