import { Table } from "govuk-react"

interface TableRowProps {
  label: string
  value: string | number | null | undefined | React.ReactNode
}

export const TableRow = ({ label, value }: TableRowProps) => (
  <Table.Row>
    <Table.Cell>
      <b>{label}</b>
    </Table.Cell>
    <Table.Cell>{value}</Table.Cell>
  </Table.Row>
)
