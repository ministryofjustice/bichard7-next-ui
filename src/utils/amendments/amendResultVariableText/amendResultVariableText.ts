import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { UpdatedOffenceResult, ValidProperties } from "types/Amendments"
import amendDefendantOrOffenceResult from "../amendDefendantOrOffenceResult"

const amendResultVariableText = (offences: UpdatedOffenceResult[], aho: AnnotatedHearingOutcome) =>
  offences.forEach(({ offenceIndex, resultIndex, updatedValue }: UpdatedOffenceResult) =>
    amendDefendantOrOffenceResult({ offenceIndex, resultIndex }, aho, ValidProperties.ResultVariableText, updatedValue)
  )

export default amendResultVariableText
