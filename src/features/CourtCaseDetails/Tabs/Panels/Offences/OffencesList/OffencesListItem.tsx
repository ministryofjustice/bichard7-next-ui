import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import { formatDisplayedDate } from "utils/formattedDate"
import getOffenceCode from "utils/getOffenceCode"

interface OffencesListRowProps {
  offence: Offence
  number: number
  onClick: (offence: Offence) => void
}

export const OffencesListRow = ({ offence, onClick, number }: OffencesListRowProps) => (
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
