import type { CSSProperties } from "styled-components"
import { Table } from "govuk-react"

interface TableRowProps {
  label: string
  hintText?: string
  value: string | number | null | undefined | React.ReactNode
  className?: string
}

const style: CSSProperties = {
  verticalAlign: "top"
}

export const TableRow = ({ label, value }: TableRowProps) => (
  <Table.Row className={`table-row__${label.split(" ").join("-").toLowerCase()}`}>
    <Table.Cell style={style}>
      <b>{label}</b>
      <header>
        <h1>{"hello"}</h1>
      </header>
      {/* {hintText && <HintText>{hintText}</HintText>} */}
    </Table.Cell>
    <Table.Cell>{value}</Table.Cell>
  </Table.Row>
)
