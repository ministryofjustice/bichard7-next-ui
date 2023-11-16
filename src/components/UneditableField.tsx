import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import { textSecondary } from "utils/colours"
import Badge from "./Badge"
import ErrorIcon from "./ErrorIcon"

type Props = {
  badgeText: string
  message: string
  value?: string
  badgeColour: "purple"
  label: string
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
    "& .error-prompt-message": {
      color: textSecondary
    },
    "& .invalid-value": {
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

const UneditableField = ({ badgeText, badgeColour, message, value, label, children }: Props) => {
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
      {value && <div className="invalid-value">{value}</div>}
      {badgeText && (
        <div className="badge-wrapper">
          <Badge className="error-prompt-badge" isRendered={true} colour={badgeColour} label={badgeText} />
        </div>
      )}
      {message && <div className="error-prompt-message">{message}</div>}
    </div>
  )

  return (
    <Table.Row>
      <Table.Cell className={classes.label}>
        <b>{labelField}</b>
      </Table.Cell>
      <Table.Cell>{children ?? cellContent}</Table.Cell>
    </Table.Row>
  )
}

export default UneditableField
