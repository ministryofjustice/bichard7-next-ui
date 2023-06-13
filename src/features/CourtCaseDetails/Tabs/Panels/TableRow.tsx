import type { CSSProperties } from "styled-components"
import { Table } from "govuk-react"

interface TableRowProps {
  label: string
  value: string | number | null | undefined | React.ReactNode
}

const style: CSSProperties = {
  verticalAlign: "top"
}

export const TableRow = ({ label, value }: TableRowProps) => (
  <Table.Row id={`table-row-${label.replaceAll(" ", "-").toLowerCase()}`}>
    <Table.Cell style={style}>
      <b>{label}</b>
    </Table.Cell>
    <Table.Cell>{value}</Table.Cell>
  </Table.Row>
)
