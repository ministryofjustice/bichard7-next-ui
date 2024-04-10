import { Table } from "govuk-react"
import styled from "styled-components"
import InitialValueAndCorrectionField from "./InitialValueAndCorrectionField"
import InputField from "./InputField"
import LabelField from "./LabelField"

type Props = {
  label: string
  hasExceptions: boolean
  value?: string | React.ReactNode
  updatedValue?: string | null
  isEditable: boolean
  children?: React.ReactNode
}

const LabelCell = styled(Table.Cell)`
  vertical-align: top;
  & .error-icon: {
    padding-top: 0.62rem;
  }
`

const EditableFieldTableRow = ({ value, updatedValue, label, hasExceptions, isEditable, children }: Props) => {
  const isRendered = !!(value || updatedValue || hasExceptions)
  const hasCorrection = updatedValue && value !== updatedValue

  if (!isRendered) {
    return
  }

  const fieldToRender = (): React.ReactNode => {
    if (isEditable) {
      return <InputField value={value}>{children}</InputField>
    } else if (hasCorrection) {
      return <InitialValueAndCorrectionField value={value} updatedValue={updatedValue} />
    } else {
      return value
    }
  }

  return (
    <Table.Row>
      <LabelCell>
        <LabelField label={label} isEditable={isEditable} />
      </LabelCell>
      <Table.Cell>{fieldToRender()}</Table.Cell>
    </Table.Row>
  )
}

export default EditableFieldTableRow
