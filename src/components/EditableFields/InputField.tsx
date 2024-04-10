import styled from "styled-components"
import { EditableFieldBadge, InitialInputValueBadge } from "./Badges"

interface EditableInputFieldProps {
  value?: string | React.ReactNode
  children?: React.ReactNode
}

const S = {
  InputField: styled.div`
    & .badge-wrapper: {
      padding: 0.94rem 0 0.62rem 0;
      display: flex;
      gap: 0.62rem;
      align-items: center;
    }
  `
}

const InputField: React.FC<EditableInputFieldProps> = ({ value, children }) => {
  return (
    <S.InputField>
      {value}
      <InitialInputValueBadge />
      <br />
      {children}
      <EditableFieldBadge />
    </S.InputField>
  )
}

export default InputField
