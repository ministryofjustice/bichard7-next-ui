import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import getOffenceCode from "utils/getOffenceCode"

interface OffencesTableProps {
  offences: Offence[]
}

export const OffencesTable = ({ offences }: OffencesTableProps) => {
  return (
    <Table
      head={
        <Table.Row>
          <Table.CellHeader>{"Offence number"}</Table.CellHeader>
          <Table.CellHeader>{"Date"}</Table.CellHeader>
          <Table.CellHeader>{"Code"}</Table.CellHeader>
          <Table.CellHeader>{"Title"}</Table.CellHeader>
        </Table.Row>
      }
    >
      {offences.length > 0 &&
        offences.map((offence, index) => (
          <Table.Row key={getOffenceCode(offence)}>
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>{offence.ActualOffenceStartDate.StartDate.toString()}</Table.Cell>
            <Table.Cell>{getOffenceCode(offence)}</Table.Cell>
            <Table.Cell>{offence.OffenceTitle}</Table.Cell>
          </Table.Row>
        ))}
    </Table>
  )
}
