import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import Badge from "./Badge"
import ErrorIcon from "./ErrorIcon"

type Props = {
  label: string
  isEditable: boolean
  value?: string | React.ReactNode
  updatedValue?: string | null
  children?: React.ReactNode
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

const initialValueBadge = <Badge className="error-badge" isRendered={true} colour={"grey"} label={"Initial Value"} />
const editableFieldBadge = (
  <Badge className="error-badge" isRendered={true} colour={"purple"} label={"Editable Field"} />
)
const correctionBadge = <Badge className="error-badge" isRendered={true} colour={"green"} label={"Correction"} />

const EditableFieldTableRow = ({ value, updatedValue, label, isEditable, children }: Props) => {
  const classes = useStyles()
  const hasCorrection = updatedValue && value !== updatedValue

  const labelField = (
    <>
      <div>{label}</div>
    </>
  )

  const inputField = (
    <div className={classes.content}>
      {value && <div className="field-value">{value}</div>}
      {<div className="badge-wrapper">{initialValueBadge}</div>}
      {children}
      {<div className="badge-wrapper">{editableFieldBadge}</div>}
    </div>
  )

  return (
    <Table.Row>
      <Table.Cell className={classes.label}>
        <b>{labelField}</b>
        {!!isEditable && (
          <div className="error-icon">
            <ErrorIcon />
          </div>
        )}
      </Table.Cell>
      {isEditable ? (
        <Table.Cell>{inputField}</Table.Cell>
      ) : hasCorrection ? (
        <>
          <Table.Cell>
            {value}
            <br />
            {initialValueBadge}
            <br />
            <br />
            {updatedValue}
            <br />
            {correctionBadge}
          </Table.Cell>
        </>
      ) : (
        <Table.Cell>{value}</Table.Cell>
      )}
    </Table.Row>
  )
}

export default EditableFieldTableRow
