import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import { formatDisplayedDate } from "utils/formattedDate"
import getOffenceCode from "utils/getOffenceCode"

interface OffencesTableProps {
  offences: Offence[]
  setDetailedOffence: (offence: Offence) => void
}

interface HearingTableRowProps {
  offence: Offence
  number: number
  onClick: (offence: Offence) => void
}

const HearingTableRow = ({ offence, onClick, number }: HearingTableRowProps) => (
  <Table.Row>
    <Table.Cell>{number}</Table.Cell>
    <Table.Cell>{formatDisplayedDate(offence.ActualOffenceStartDate.StartDate)}</Table.Cell>
    <Table.Cell>{getOffenceCode(offence)}</Table.Cell>
    <Table.Cell>
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault()
          onClick(offence)
        }}
      >
        {offence.OffenceTitle}
      </a>
    </Table.Cell>
  </Table.Row>
)

export const OffencesTable = ({ offences, setDetailedOffence }: OffencesTableProps) => {
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
            offence={offence}
            number={index + 1}
            onClick={setDetailedOffence}
          />
        ))}
    </Table>
  )
}
