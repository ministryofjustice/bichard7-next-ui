import { Table } from "govuk-react"
import { useCustomStyles } from "../../../styles/customStyles"
import { BadgeColours } from "../Badge"
import ConditionalRender from "../ConditionalRender"
import ErrorIcon from "../ErrorIcon"
import BadgeWrapper from "./EditableBadgeWrapper"

type Props = {
  label: string
  hasExceptions: boolean
  value?: string | React.ReactNode
  updatedValue?: string | null
  isEditable: boolean
  children?: React.ReactNode
}

const initialValueBadge = <BadgeWrapper colour={BadgeColours.Grey} label={"Initial Value"} />
const editableFieldBadge = <BadgeWrapper colour={BadgeColours.Purple} label={"Editable Field"} />
const correctionBadge = <BadgeWrapper colour={BadgeColours.Green} label={"Correction"} />

const EditableFieldTableRow = ({ value, updatedValue, label, hasExceptions, isEditable, children }: Props) => {
  const classes = useCustomStyles()
  const isRendered = !!(value || updatedValue || hasExceptions)
  const hasCorrection = updatedValue && value !== updatedValue

  const labelField = (
    <>
      <b>
        <div>{label}</div>
      </b>
      {isEditable && (
        <div className="error-icon">
          <ErrorIcon />
        </div>
      )}
    </>
  )

  const inputField = (
    <>
      <div className={classes["editable-field__content"]}>
        {value}
        {initialValueBadge}
        <br />
        {children}
        {editableFieldBadge}
      </div>
    </>
  )

  const initialValueAndCorrectionField = (
    <>
      {value}
      {initialValueBadge}
      <br />
      {updatedValue}
      {correctionBadge}
    </>
  )

  const fieldToRender = (): React.ReactNode => {
    if (isEditable) {
      return inputField
    } else if (hasCorrection) {
      return initialValueAndCorrectionField
    } else {
      return value
    }
  }

  return (
    <ConditionalRender isRendered={isRendered}>
      <Table.Row>
        <Table.Cell className={classes["editable-field__label"]}>{labelField}</Table.Cell>
        <Table.Cell>{fieldToRender()}</Table.Cell>
      </Table.Row>
    </ConditionalRender>
  )
}

export default EditableFieldTableRow
