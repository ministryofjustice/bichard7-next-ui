import { HintText, Table } from "govuk-react"
import { createUseStyles } from "react-jss"

interface TableRowProps {
  label: string
  hintText?: string
  value: string | number | null | undefined | React.ReactNode
  className?: string
}

const useStyles = createUseStyles({
  row: {
    "& td": {
      verticalAlign: "top"
    }
  },
  hintText: {
    marginBottom: "0"
  }
})

export const TableRow = ({ label, value, hintText }: TableRowProps) => {
  const classes = useStyles()
  const rowClassName = `table-row__${label.replaceAll(/ /g, "-").toLowerCase()}`
  return (
    <Table.Row className={`table-row ${rowClassName} ${classes.row}`}>
      <Table.Cell>
        <b>{label}</b>
        {hintText && <HintText className={classes.hintText}>{hintText}</HintText>}
      </Table.Cell>
      <Table.Cell>{value}</Table.Cell>
    </Table.Row>
  )
}
