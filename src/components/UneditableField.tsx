import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import { textSecondary } from "utils/colours"
import Badge from "./Badge"
import ErrorIcon from "./ErrorIcon"

type Props = {
  badge: string
  message: string
  code?: string
  colour: string
  label: string
}

const useStyles = createUseStyles({
  label: {
    verticalAlign: "top",
    "& .error-icon": {
      paddingTop: ".62rem"
    }
  },
  value: {
    "& .error-prompt-message": {
      color: textSecondary
    },
    "& .qualifier-code": {
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
const UneditableField = ({ badge, message, code, colour, label }: Props) => {
  const classes = useStyles()
  const labelField = (
    <>
      <div> {label}</div>
      <div className="error-icon">
        <ErrorIcon />
      </div>
    </>
  )
  const value = (
    <div className={classes.value}>
      <div className="qualifier-code">{code}</div>
      <div className="badge-wrapper">
        <Badge className="error-prompt-badge" isRendered={true} colour={colour} label={badge} />
      </div>
      <div className="error-prompt-message">{message}</div>
    </div>
  )
  return (
    <Table.Row>
      <Table.Cell className={classes.label}>
        <b>{labelField}</b>
      </Table.Cell>
      <Table.Cell>{value}</Table.Cell>
    </Table.Row>
  )
}

export default UneditableField
