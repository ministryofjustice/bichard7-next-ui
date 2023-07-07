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
  return (
    <>
      <div>{DateCode[parseInt(offence.ActualOffenceDateCode)]}</div>
      <div>{offence.ActualOffenceStartDate && formatDisplayedDate(offence.ActualOffenceStartDate.StartDate)}</div>
      <div style={{ color: textSecondary }}>{`Date code: ${offence.ActualOffenceDateCode}`}</div>
    </>
  )
}
