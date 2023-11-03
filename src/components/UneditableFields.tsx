import Badge from "./Badge"
import { textSecondary } from "utils/colours"
import { createUseStyles } from "react-jss"
import { Table } from "govuk-react"
import ErrorIcon from "./ErrorIcon"

type Props = {
  badge: string
  message: string
  code: string
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
    "& .message": {
      color: textSecondary
    },
    "& .qualifier-code": {
      paddingBottom: ".94rem"
    },
    "& .badge": {
      paddingBottom: ".62rem",
      display: "flex",
      gap: ".62rem",
      alignItems: "center",
      "& .last-updated": {
        fontSize: "1rem",
        fontStyle: "normal",
        fontWeight: "300",
        color: textSecondary
      }
    }
  }
})
const UneditableFields = ({ badge, message, code, colour, label }: Props) => {
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
      <div className="badge">
        <div>
          <Badge isRendered={true} colour={colour} label={badge} />
        </div>
        <div className="last-updated">{"Last Updated: 13:01 - 04/07/23"}</div>
      </div>
      <div className="message">{message}</div>
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

export default UneditableFields
