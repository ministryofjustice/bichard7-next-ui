import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import { getDisplayDateFromDateOrString } from "utils/formattedDate"
import getOffenceCode from "utils/getOffenceCode"

interface OffencesTableProps {
  offences: Offence[]
}

interface HearingTableRowProps {
  number: number
  date: string
  code: string
  title: string | undefined
}

const HearingTableRow = ({ number, date, code, title }: HearingTableRowProps) => (
  <Table.Row>
    <Table.Cell>{number}</Table.Cell>
    <Table.Cell>{getDisplayDateFromDateOrString(date)}</Table.Cell>
    <Table.Cell>{code}</Table.Cell>
    <Table.Cell>{title}</Table.Cell>
  </Table.Row>
)

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
          <HearingTableRow
            key={getOffenceCode(offence)}
            number={index + 1}
            date={offence.ActualOffenceStartDate.StartDate.toString()}
            code={getOffenceCode(offence)}
            title={offence.OffenceTitle}
          />
        ))}
    </Table>
  )
}
