import { Table } from "govuk-react"

interface TableRowProps {
  label: string
  value: string | number | null | undefined | React.ReactNode
}

const style = {
  verticalAlign: "top"
}

export const TableRow = ({ label, value }: TableRowProps) => (
  <Table.Row>
    <Table.Cell style={style}>
      <b>{label}</b>
    </Table.Cell>
    <Table.Cell>{value}</Table.Cell>
  </Table.Row>
)
