import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { textSecondary } from "utils/colours"
import { formatDisplayedDate } from "utils/formattedDate"

export enum DateCode {
  "On or in" = 1,
  "Before" = 2,
  "After" = 3,
  "Between" = 4,
  "On or about" = 5,
  "On or before" = 6
}

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
      <div>{DateCode[parseInt(ActualOffenceDateCode)]}</div>
      <div>{dateField}</div>
      <div style={{ color: textSecondary }}>{`Date code: ${ActualOffenceDateCode}`}</div>
    </>
  )
}
