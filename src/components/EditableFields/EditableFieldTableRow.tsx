import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
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
  inputLabel: string
  hintText: string
}

const useStyles = createUseStyles({
  "editable-field__label": {
    verticalAlign: "top",
    "& .error-icon": {
      paddingTop: ".62rem"
    }
  }
})

const EditableFieldTableRow = ({
  value,
  updatedValue,
  label,
  hasExceptions,
  isEditable,
  inputLabel,
  hintText,
  children
}: Props) => {
  const classes = useStyles()
  const isRendered = !!(value || updatedValue || hasExceptions)
  const hasCorrection = updatedValue && value !== updatedValue

  if (!isRendered) {
    return
  }

  const fieldToRender = (): React.ReactNode => {
    if (isEditable) {
      return (
        <InputField value={value} inputLabel={inputLabel} hintText={hintText}>
          {children}
        </InputField>
      )
    } else if (hasCorrection) {
      return <InitialValueAndCorrectionField value={value} updatedValue={updatedValue} />
    } else {
      return value
    }
  }

  return (
    <Table.Row>
      <Table.Cell className={classes["editable-field__label"]}>
        <LabelField label={label} isEditable={isEditable} />
      </Table.Cell>
      <Table.Cell>{fieldToRender()}</Table.Cell>
    </Table.Row>
  )
}

export default EditableFieldTableRow
