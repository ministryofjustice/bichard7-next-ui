import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import Badge from "./Badge"
import ConditionalRender from "./ConditionalRender"
import ErrorIcon from "./ErrorIcon"
import { ReactiveLinkButton } from "./LinkButton"

type Props = {
  label: string
  hasExceptions: boolean
  value?: string | React.ReactNode
  updatedValue?: string | null
  isEditable: boolean
  children?: React.ReactNode
  handleEditBtn?: () => void
  isCorrectionEdit?: boolean
}

const useStyles = createUseStyles({
  label: {
    verticalAlign: "top",
    "& .error-icon": {
      paddingTop: ".62rem"
    }
  },
  content: {
    "& .badge-wrapper": {
      padding: ".94rem 0 .62rem 0",
      display: "flex",
      gap: ".62rem",
      alignItems: "center"
    }
  }
})

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

const EditableFieldTableRow = ({
  value,
  updatedValue,
  label,
  hasExceptions,
  isEditable,
  children,
  handleEditBtn,
  isCorrectionEdit
}: Props) => {
  const classes = useStyles()
  const isRendered = !!(value || updatedValue || hasExceptions)
  const hasCorrection = updatedValue && value !== updatedValue && !isCorrectionEdit

  const handleEdit = handleEditBtn ? true : false
  const handleClick = () => {
    if (handleEditBtn) {
      handleEditBtn()
    }
  }

  const labelField = (
    <>
      <b>
        <div>{label}</div>
      </b>
      {!hasCorrection && isEditable && (
        <div className="error-icon">
          <ErrorIcon />
        </div>
      )}
      {hasCorrection && isEditable && <div className="tick-icon">{/* <TickIcon /> */}</div>}
    </>
  )

  const inputField = (
    <>
      <div className={classes.content}>
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
      <ConditionalRender isRendered={handleEdit}>
        <ReactiveLinkButton id={"edit-asn"} onClick={handleClick}>
          {"Edit"}
        </ReactiveLinkButton>
      </ConditionalRender>
    </>
  )

  return (
    <ConditionalRender isRendered={isRendered}>
      <Table.Row>
        <Table.Cell className={classes.label}>{labelField}</Table.Cell>
        <Table.Cell>{hasCorrection ? initialValueAndCorrectionField : isEditable ? inputField : value}</Table.Cell>
      </Table.Row>
    </ConditionalRender>
  )
}

export default EditableFieldTableRow
