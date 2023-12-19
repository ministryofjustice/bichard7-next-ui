import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import Badge from "./Badge"
import ErrorIcon from "./ErrorIcon"

type Props = {
  badgeText: "System Error" | "Editable Field"
  value?: string | React.ReactNode
  badgeColour?: "red" | "blue" | "purple"
  label: string
  children?: React.ReactNode
  displayError?: boolean
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

const ExceptionFieldTableRow = ({ badgeText, badgeColour, value, label, displayError, children }: Props) => {
  const classes = useStyles()
  const labelField = (
    <>
      <div>{label}</div>
      {displayError !== false && (
        <div className="error-icon">
          <ErrorIcon />
        </div>
      )}
    </>
  )

  const cellContent = (
    <div className={classes.content}>
      {value && <div className="field-value">{value}</div>}
      {badgeText && displayError !== false && (
        <div className="badge-wrapper">
          <Badge className="error-badge" isRendered={true} colour={badgeColour ?? "purple"} label={badgeText} />
        </div>
      )}
      {displayError !== false && children}
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

export default ExceptionFieldTableRow
