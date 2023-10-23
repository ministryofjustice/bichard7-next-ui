import type { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { DateCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { DateCodes } from "@moj-bichard7-developers/bichard7-next-data/dist/types/DateCode"
import { textSecondary } from "utils/colours"
import { formatDisplayedDate } from "utils/formattedDate"
import { capitalizeString } from "utils/capitaliseString"

interface StartDateProps {
  offence: Offence
}

export const StartDate = ({ offence }: StartDateProps) => {
  const { ActualOffenceDateCode, ActualOffenceStartDate, ActualOffenceEndDate } = offence

  const startDate = formatDisplayedDate(ActualOffenceStartDate.StartDate)
  const endDate = formatDisplayedDate(ActualOffenceEndDate?.EndDate || "")
  const dateField = endDate ? `${startDate} and ${endDate}` : startDate

  return (
    <>
      <div>{capitalizeString(DateCodes[parseInt(ActualOffenceDateCode) as DateCode])}</div>
      <div>{dateField}</div>
      <div style={{ color: textSecondary }}>{`Date code: ${ActualOffenceDateCode}`}</div>
    </>
  )
}
