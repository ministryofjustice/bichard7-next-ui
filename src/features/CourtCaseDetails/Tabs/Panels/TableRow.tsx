import { Table } from "govuk-react"

interface TableRowProps {
  header: string
  value: string | null | undefined
}

export const TableRow = ({ header, value }: TableRowProps) => (
  <Table.Row>
    <Table.Cell>
      <b>{header}</b>
    </Table.Cell>
    <Table.Cell>{value}</Table.Cell>
  </Table.Row>
)
