import { TextArea } from "govuk-react"
import { IndividualAmendmentValues, RelevantIndexes } from "types/Amendments"

const ResultVariableText: React.FC<{
  text: string
  relevantIndexes: RelevantIndexes
  amendFn: (newValue: IndividualAmendmentValues) => void
}> = ({ text, relevantIndexes, amendFn }) => (
  <TextArea
    input={{
      placeholder: text,
      maxLength: 2500,
      onChange: (event) =>
        amendFn({
          ...relevantIndexes,
          updatedValue: event.target.value
        })
    }}
  >
    <label>{"text"}</label>
  </TextArea>
)

export default ResultVariableText
