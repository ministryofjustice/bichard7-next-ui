import isException from "utils/isException"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/ExceptionCode"
import { InputField } from "govuk-react"
import get from "lodash.get"

const EditableField: React.FC<{
  aho: AnnotatedHearingOutcome
  objPath: string
  amendFn: (newValue: string) => void
}> = ({ aho, objPath, amendFn }) => {
  const result: ExceptionCode | null = isException(aho, objPath)
  const value = (get(aho, objPath, "") ?? "").toString() // object is returned for dates

  return Boolean(result) ? (
    <InputField
      input={{
        onChange: (event) => amendFn(event.target.value)
      }}
      meta={{
        error: result as ExceptionCode,
        touched: true
      }}
    >
      {value}
    </InputField>
  ) : (
    <>{value}</>
  )
}

export default EditableField
