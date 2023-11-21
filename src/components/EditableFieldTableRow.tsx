import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import Badge from "./Badge"
import ErrorIcon from "./ErrorIcon"

type Props = {
  currentValue?: string | React.ReactNode
  editableField: string | React.ReactNode
  label: string
}

const useStyles = createUseStyles({
  label: {
    verticalAlign: "top",
    "& .error-icon": {
      paddingTop: ".62rem"
    }
  },
  content: {
    "& .field-value": {
      paddingBottom: ".94rem"
    },
    "& .badge-wrapper": {
      paddingBottom: ".62rem",
      display: "flex",
      gap: ".62rem",
      alignItems: "center"
    }
  }
})

const EditableFieldTableRow = ({ label, currentValue, editableField }: Props) => {
  const classes = useStyles()
  const labelField = (
    <>
      <div>{label}</div>
      <div className="error-icon">
        <ErrorIcon />
      </div>
    </>
  )

  const cellContent = (
    <div className={classes.content}>
      <div className="field-value">{currentValue}</div>
      <div className="badge-wrapper">
        <Badge className="editable-field" isRendered={true} colour={"purple"} label={"Editable Field"} />
      </div>
      {editableField}
    </div>
  )

  return (
    <Table.Row>
      <Table.Cell className={classes.label}>
        <b>{labelField}</b>
      </Table.Cell>
      <Table.Cell>{cellContent}</Table.Cell>
    </Table.Row>
  )
}

export default EditableFieldTableRow
