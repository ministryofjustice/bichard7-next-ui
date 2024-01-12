import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { AmendmentRecords } from "../../types/Amendments"
import setAmendedField from "../amendments/setAmendedField"
import { hasUpdate } from "./hasUpdate"
import { formatFormInputDateString } from "../formattedDate"

const getUpdatedNextHearingDate = (
  result: Result,
  updatedOffenceResult: Result,
  offenceIndex: number,
  resultIndex: number,
  updatedFields: AmendmentRecords
) => {
  const updatedNextHearingDate = updatedOffenceResult?.NextHearingDate

  if (hasUpdate(result.NextHearingDate, updatedNextHearingDate)) {
    setAmendedField(
      "nextHearingDate",
      {
        resultIndex,
        offenceIndex,
        updatedValue: formatFormInputDateString(new Date(updatedNextHearingDate!))
      },
      updatedFields
    )
  }
}

export default getUpdatedNextHearingDate
