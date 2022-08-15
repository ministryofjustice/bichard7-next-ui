import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { UpdatedOffenceResult, ValidProperties } from "types/Amendments"
import amendDefendantOrOffenceResult from "../amendDefendantOrOffenceResult"

const amendResultVariableText = (
  { offenceIndex, resultIndex, updatedValue }: UpdatedOffenceResult,
  aho: AnnotatedHearingOutcome
) => amendDefendantOrOffenceResult({ offenceIndex, resultIndex }, aho, ValidProperties.ResultVariableText, updatedValue)

export default amendResultVariableText
