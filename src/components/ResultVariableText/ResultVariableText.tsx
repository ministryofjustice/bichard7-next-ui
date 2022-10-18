import { TextArea } from "govuk-react"

const ResultVariableText: React.FC<{ text: string }> = ({ text }) => (
  <TextArea
    input={{
      placeholder: text,
      maxLength: 2500
    }}
  >
    <label>{"text"}</label>
  </TextArea>
)

export default ResultVariableText
