import { EditableFieldBadge, InitialInputValueBadge } from "./Badges"
import { StyledInputField } from "./InputField.styles"

interface EditableInputFieldProps {
  value?: string | React.ReactNode
  children?: React.ReactNode
}

const InputField: React.FC<EditableInputFieldProps> = ({ value, children }) => {
  return (
    <StyledInputField>
      {value}
      <InitialInputValueBadge />
      <br />
      {children}
      <EditableFieldBadge />
    </StyledInputField>
  )
}

export default InputField
