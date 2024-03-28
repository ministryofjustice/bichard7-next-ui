import { Table } from "govuk-react"
import { useCustomStyles } from "../../../styles/customStyles"
import Badge from "../Badge"
import ConditionalRender from "../ConditionalRender"
import ErrorIcon from "../ErrorIcon"

type Props = {
  label: string
  hasExceptions: boolean
  value?: string | React.ReactNode
  updatedValue?: string | null
  isEditable: boolean
  children?: React.ReactNode
}

const initialValueBadge = (
  <div className="badge-wrapper">
    <Badge className="error-badge" isRendered={true} colour={"grey"} label={"Initial Value"} />
  </div>
)
const editableFieldBadge = (
  <div className="badge-wrapper">
    <Badge className="error-badge" isRendered={true} colour={"purple"} label={"Editable Field"} />
  </div>
)
const correctionBadge = (
  <div className="badge-wrapper">
    <Badge className="error-badge" isRendered={true} colour={"green"} label={"Correction"} />
  </div>
)

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
