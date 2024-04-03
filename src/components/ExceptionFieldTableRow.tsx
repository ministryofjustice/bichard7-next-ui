import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import Badge, { BadgeColours } from "./Badge"
import ErrorIcon from "./ErrorIcon"

export enum ExceptionBadgeType {
  SystemError = "System Error",
  AddedByCourt = "Added by Court",
  Unmatched = "Unmatched"
}

type Props = {
  badgeText?: ExceptionBadgeType
  value?: string | React.ReactNode
  badgeColour?: BadgeColours
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
          <Badge
            className="error-badge"
            isRendered={true}
            colour={badgeColour ?? BadgeColours.Purple}
            label={badgeText}
          />
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
