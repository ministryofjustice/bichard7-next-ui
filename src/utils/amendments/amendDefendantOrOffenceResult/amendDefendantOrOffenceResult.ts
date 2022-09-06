import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { UpdatedOffence, ValidProperties } from "types/Amendments"

const amendDefendantOrOffenceResult = (
  { offenceIndex, resultIndex }: UpdatedOffence,
  aho: AnnotatedHearingOutcome,
  propertyToAmend: ValidProperties,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueToAmend: any
) => {
  const defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  if (offenceIndex === -1) {
    if (!defendant.Result) {
      throw new Error(`Cannot update the ${propertyToAmend}; Result in undefined`)
    }
    defendant.Result[propertyToAmend] = valueToAmend
    return
  }

  const offenceIndexOutOfRange = offenceIndex > defendant.Offence.length - 1
  if (offenceIndexOutOfRange) {
    throw new Error(`Cannot update the ${propertyToAmend}; Offence index is out of range`)
  }

  const resultIndexOutOfRange = resultIndex > defendant.Offence[offenceIndex].Result.length - 1
  if (resultIndexOutOfRange) {
    throw new Error(`Cannot update ${propertyToAmend}; Result index on Offence is out of range`)
  }

  defendant.Offence[offenceIndex].Result[resultIndex][propertyToAmend] = valueToAmend
  return
}

export default amendDefendantOrOffenceResult
