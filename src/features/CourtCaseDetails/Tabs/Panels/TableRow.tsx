import type { CSSProperties } from "styled-components"
import { Table } from "govuk-react"

interface TableRowProps {
  label: string
  value: string | number | null | undefined | React.ReactNode
  className?: string
}

const style: CSSProperties = {
  verticalAlign: "top"
}
export const TableRow = ({ label, value }: TableRowProps) => (
  <Table.Row className={`table-row-${label.split(" ").join("-").toLowerCase()}`}>
    <Table.Cell style={style}>
      <b>{label}</b>
    </Table.Cell>
    <Table.Cell>{value}</Table.Cell>
  </Table.Row>
)
