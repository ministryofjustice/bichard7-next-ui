import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import { formatDisplayedDate } from "utils/formattedDate"
import getOffenceCode from "utils/getOffenceCode"

interface OffencesListRowProps {
  offence: Offence
  number: number
  onClick: (offence: Offence) => void
}

export const OffencesListRow = ({ offence, onClick, number }: OffencesListRowProps) => {

  return (
    <Table.Row>
      <Table.Cell>{number}</Table.Cell>
      <Table.Cell>{formatDisplayedDate(new Date(offence.ActualOffenceStartDate.StartDate)).toString()}</Table.Cell>
      <Table.Cell>{getOffenceCode(offence)}</Table.Cell>
      <Table.Cell>
        <a
          className="govuk-link"
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
}
