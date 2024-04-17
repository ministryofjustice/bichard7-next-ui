import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import WarningIcon from "components/WarningIcon"
import { useCourtCase } from "context/CourtCaseContext"
import { Table } from "govuk-react"
import Image from "next/image"
import { formatDisplayedDate } from "utils/formattedDate"
import getOffenceAlertsDetails from "utils/getOffenceAlertsDetails"
import getOffenceCode from "utils/getOffenceCode"
import { CHECKMARK_ICON_URL } from "utils/icons"
import { IconContainer } from "./OffencesListRow.styles"

interface OffencesListRowProps {
  offence: Offence
  onClick: (offence: Offence) => void
}

export const OffencesListRow = ({ offence, onClick }: OffencesListRowProps) => {
  const { courtCase, amendments } = useCourtCase()
  const exceptions = courtCase.aho.Exceptions

  const offenceAlerts = getOffenceAlertsDetails(exceptions, amendments)

  const checkmarkIcon = (
    <IconContainer className={`icon checkmark-icon`} key={offence.CourtOffenceSequenceNumber}>
      <Image src={CHECKMARK_ICON_URL} width={30} height={30} alt="Checkmark icon" />
    </IconContainer>
  )
  const warningIcon = (
    <IconContainer className={`icon warning-icon`} key={offence.CourtOffenceSequenceNumber}>
      <WarningIcon />
    </IconContainer>
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
