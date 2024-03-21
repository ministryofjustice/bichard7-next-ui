import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import Badge from "./Badge"
import ErrorIcon from "./ErrorIcon"

type Props = {
  badgeText?: "System Error" | "Added by Court" | "Unmatched"
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
      padding: ".62rem 0 .62rem 0"
    }
  },
  content: {
    verticalAlign: "top",
    "& .badge-wrapper": {
      paddingBottom: ".62rem",
      display: "flex",
      gap: ".62rem",
      alignItems: "center"
    },
    "& .field-value": {
      paddingBottom: ".62rem"
    }
  }
})

const ExceptionFieldTableRow = ({ badgeText, badgeColour, value, label, displayError, children }: Props) => {
  const classes = useStyles()
  const labelField = (
    <>
      <b>{label}</b>
      {displayError !== false && (
        <>
          <div className="error-icon">
            <ErrorIcon />
          </div>
          {children}
        </>
      )}
    </>
  )

  const cellContent = (
    <div>
      {value && <div className="field-value">{value}</div>}
      {badgeText && displayError !== false && (
        <div className="badge-wrapper">
          <Badge className="error-badge" isRendered={true} colour={badgeColour ?? "purple"} label={badgeText} />
        </div>
      )}
    </div>
  )

  return (
    <Table.Row>
      <Table.Cell className={classes.label}>{labelField}</Table.Cell>
      <Table.Cell className={classes.content}>{cellContent}</Table.Cell>
    </Table.Row>
  )
}

export default ExceptionFieldTableRow
