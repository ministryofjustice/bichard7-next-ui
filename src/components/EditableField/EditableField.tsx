import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/dist/types/ExceptionCode"
import ResultVariableText from "components/ResultVariableText/ResultVariableText"
import { InputField } from "govuk-react"
import get from "lodash.get"
import { IndividualAmendmentValues, RelevantIndexes } from "types/Amendments"
import isException from "utils/isException"

const EditableField: React.FC<{
  aho: AnnotatedHearingOutcome
  objPath: string
  amendFn: (newValue: IndividualAmendmentValues) => void
  relevantIndexes?: RelevantIndexes
}> = ({ aho, objPath, amendFn, relevantIndexes }) => {
  const result: ExceptionCode | null = isException(aho, objPath)
  const value = (get(aho, objPath, "") ?? "").toString() // object is returned for dates

  return Boolean(result) ? (
    objPath.includes("ResultVariableText") && relevantIndexes ? (
      <ResultVariableText text={value} relevantIndexes={relevantIndexes} amendFn={amendFn} />
    ) : (
      <InputField
        input={{
          onChange: (event) =>
            amendFn(
              relevantIndexes
                ? {
                    ...relevantIndexes,
                    updatedValue: event.target.value
                  }
                : event.target.value
            )
        }}
        meta={{
          error: result as ExceptionCode,
          touched: true
        }}
      >
        {value}
      </InputField>
    )
  ) : objPath.includes("ResultVariableText") && relevantIndexes ? (
    <ResultVariableText text={value} relevantIndexes={relevantIndexes} amendFn={amendFn} />
  ) : (
    <>{value}</>
  )
}

export default EditableField
