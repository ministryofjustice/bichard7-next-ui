import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import Badge from "./Badge"
import ErrorIcon from "./ErrorIcon"
import { useCourtCase } from "../context/CourtCaseContext"

type Props = {
  value?: string | React.ReactNode
  updatedValue?: string | null
  label: string
  children?: React.ReactNode
  displayError?: boolean
  hasException?: boolean
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

const EditableFieldTableRow = ({ value, updatedValue, label, displayError, hasException, children }: Props) => {
  const classes = useStyles()
  const isEditable = useCourtCase().errorStatus === "Unresolved"
  const hasCorrection = updatedValue && value !== updatedValue

  const labelField = (
    <>
      <div>{label}</div>
    </>
  )

  const cellContent = (
    <div className={classes.content}>
      {value && <div className="field-value">{value}</div>}
      {displayError !== false && (
        <div className="badge-wrapper">
          <Badge className="error-badge" isRendered={true} colour={"grey"} label={"Initial Value"} />
        </div>
      )}
      {displayError !== false && children}
    </div>
  )

  return (
    <Table.Row>
      <Table.Cell className={classes.label}>
        <b>{labelField}</b>
        {!!displayError && !isEditable && (
          <div className="error-icon">
            <ErrorIcon />
          </div>
        )}
      </Table.Cell>
      {isEditable && hasException ? (
        <Table.Cell>
          {cellContent}
          <Badge className="error-badge" isRendered={true} colour={"purple"} label={"Editable Field"} />
        </Table.Cell>
      ) : hasCorrection ? (
        <>
          <Table.Cell>
            {value}
            <br />
            <Badge className="error-badge" isRendered={true} colour={"grey"} label={"Initial Value"} />
            <br />
            <br />
            {updatedValue}
            <br />
            <Badge className="error-badge" isRendered={true} colour={"green"} label={"Correction"} />
          </Table.Cell>
        </>
      ) : (
        <Table.Cell>{value}</Table.Cell>
      )}
    </Table.Row>
  )
}

export default EditableFieldTableRow
