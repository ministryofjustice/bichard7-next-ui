import {
  AnnotatedHearingOutcome
  // ResultQualifierVariable
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { UpdatedDisposalQualifierCode } from "types/Amendments"

const createResultQualifierVariableObj = (code: string) => ({ Code: code })

const getValidIndex = (resultQualifierIndex: number, arrLen: number): number =>
  resultQualifierIndex > arrLen - 1 ? arrLen + 1 : resultQualifierIndex

const amendDisposalQualifierCode = (
  { resultQualifierIndex, resultIndex, offenceIndex, updatedValue }: UpdatedDisposalQualifierCode,
  aho: AnnotatedHearingOutcome
) => {
  // TODO: What if the update is updating many offences and many results?
  const defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  if (offenceIndex === -1) {
    if (!defendant.Result) {
      throw new Error("Cannot update the ResultQualifierVariable; Result in undefined")
    }
    const isIndexOutOfRange = resultQualifierIndex > defendant.Result.ResultQualifierVariable.length - 1
    if (isIndexOutOfRange) {
      // create result qualifier variable
      const validIndex = getValidIndex(resultQualifierIndex, defendant.Result.ResultQualifierVariable.length)
      defendant.Result.ResultQualifierVariable = [
        ...defendant.Result.ResultQualifierVariable.slice(0, validIndex),
        createResultQualifierVariableObj(updatedValue),
        ...defendant.Result.ResultQualifierVariable.slice(validIndex + 1)
      ]
      return
    } else {
      defendant.Result.ResultQualifierVariable[resultQualifierIndex].Code = updatedValue
      return
    }
  }

  const offenceIndexOutOfRange = offenceIndex > defendant.Offence.length - 1
  if (offenceIndexOutOfRange || resultIndex === undefined) {
    throw new Error(
      `Cannot update the ResultQualifierVariable; ${
        offenceIndexOutOfRange ? "offence index is out of range" : "ResultIndex is undefined"
      }`
    )
  }

  const isIndexOutOfRange =
    resultQualifierIndex > defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable.length - 1
  if (isIndexOutOfRange) {
    // create result qualifier variable
    const validIndex = getValidIndex(
      resultQualifierIndex,
      defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable.length
    )
    defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable = [
      ...defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable.slice(0, validIndex),
      createResultQualifierVariableObj(updatedValue),
      ...defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable.slice(validIndex + 1)
    ]
    return
  } else {
    defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable[resultQualifierIndex].Code =
      updatedValue
    return
  }
}

export default amendDisposalQualifierCode
