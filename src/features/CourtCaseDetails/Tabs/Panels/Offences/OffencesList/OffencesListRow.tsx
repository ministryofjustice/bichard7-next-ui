import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import { formatDisplayedDate } from "utils/formattedDate"
import getOffenceCode from "utils/getOffenceCode"
import WarningIcon from "components/WarningIcon"
import { EXCEPTION_OFFENCE_INDEX } from "config"
import { useCourtCase } from "context/CourtCaseContext"

interface OffencesListRowProps {
  offence: Offence
  onClick: (offence: Offence) => void
}

export const OffencesListRow = ({ offence, onClick }: OffencesListRowProps) => {
  const courtCase = useCourtCase()
  const exceptions = courtCase.aho.Exceptions
  const warningIcon = exceptions.map((exception, index) =>
    index === 0 && exception.path[EXCEPTION_OFFENCE_INDEX] === offence.CourtOffenceSequenceNumber - 1 ? (
      <WarningIcon key={exception.code} />
    ) : (
      exception.path[EXCEPTION_OFFENCE_INDEX] === offence.CourtOffenceSequenceNumber - 1 &&
      exception.path[EXCEPTION_OFFENCE_INDEX] !== exceptions[index - 1].path[EXCEPTION_OFFENCE_INDEX] && (
        <WarningIcon key={exception.code} />
      )
    )
  )

  return (
    <Table.Row>
      <Table.Cell>{warningIcon}</Table.Cell>
      <Table.Cell>{offence.CourtOffenceSequenceNumber}</Table.Cell>
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
