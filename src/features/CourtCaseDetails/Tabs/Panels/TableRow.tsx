import { Table } from "govuk-react"
import { StyledHintText, StyledTableRow } from "./TableRow.styles"

interface TableRowProps {
  label: string
  hintText?: string
  value: string | number | null | undefined | React.ReactNode
  className?: string
}

export const TableRow = ({ label, value, hintText }: TableRowProps) => {
  const rowClassName = `table-row__${label.replaceAll(/ /g, "-").toLowerCase()}`
  return (
    <StyledTableRow className={`table-row ${rowClassName} row`}>
      <Table.Cell>
        <b>{label}</b>
        {hintText && <StyledHintText className={"hint-text"}>{hintText}</StyledHintText>}
      </Table.Cell>
      <Table.Cell>{value}</Table.Cell>
    </StyledTableRow>
  )
}
