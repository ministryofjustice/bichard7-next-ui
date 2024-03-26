import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import { formatDisplayedDate } from "utils/formattedDate"
import getOffenceCode from "utils/getOffenceCode"
import WarningIcon from "components/WarningIcon"
import { useCourtCase } from "context/CourtCaseContext"
import getUpdatedFields from "utils/updatedFields/getUpdatedFields"
import { CHECKMARK_ICON_URL } from "utils/icons"
import Image from "next/image"
import getOffenceAlertsDetails from "utils/getOffenceAlertsDetails"

interface OffencesListRowProps {
  offence: Offence
  onClick: (offence: Offence) => void
}

export const OffencesListRow = ({ offence, onClick }: OffencesListRowProps) => {
  const courtCase = useCourtCase()
  const exceptions = courtCase.aho.Exceptions
  const updatedFields = getUpdatedFields(courtCase.aho, courtCase.updatedHearingOutcome)
  const offenceAlerts = getOffenceAlertsDetails(exceptions, updatedFields)
  const checkmarkIcon = (
    <div className={"checkmark-icon"} key={offence.CourtOffenceSequenceNumber}>
      <Image src={CHECKMARK_ICON_URL} width={30} height={30} alt="Checkmark icon" />
    </div>
  )
  const warningIcon = (
    <div className={"warning-icon"} key={offence.CourtOffenceSequenceNumber}>
      <WarningIcon />
    </div>
  )

  const offenceAlertIcon = offenceAlerts.map((offenceAlert) => {
    const isMatchingOffenceException = offenceAlert.offenceIndex === offence.CourtOffenceSequenceNumber - 1
    if (!isMatchingOffenceException) {
      return undefined
    }
    return offenceAlert.isResolved ? checkmarkIcon : warningIcon
  })

  return (
    <Table.Row>
      <Table.Cell>{offenceAlertIcon}</Table.Cell>
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
