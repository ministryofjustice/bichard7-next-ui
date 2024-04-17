import { HintText, Label } from "govuk-react"
import { EditableFieldBadge, InitialInputValueBadge } from "./Badges"
import { StyledInputField } from "./InputField.styles"

interface EditableInputFieldProps {
  value?: string | React.ReactNode
  children?: React.ReactNode
  inputLabel: string
  hintText: string
}

const InputField: React.FC<EditableInputFieldProps> = ({ value, inputLabel, hintText, children }) => {
  return (
    <StyledInputField>
      {value}
      <InitialInputValueBadge />
      <br />
      <Label>{inputLabel}</Label>
      {hintText &&
        hintText.split("\n").map((hint, key) => {
          return <HintText key={key}>{hint}</HintText>
        })}
      {children}
      <EditableFieldBadge />
    </StyledInputField>
  )
}

export default InputField
