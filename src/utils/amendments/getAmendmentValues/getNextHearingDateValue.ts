import { AmendmentRecords, UpdatedNextHearingDate } from "types/Amendments"

const getNextHearingDateValue = (
  amendmentRecords: AmendmentRecords,
  offenceIndex: number,
  resultIndex: number
): string | undefined => {
  const validDateFormat = /^20\d{2}-\d{2}-\d{2}$/
  const nextHearingDateAmendment =
    amendmentRecords?.nextHearingDate &&
    (amendmentRecords.nextHearingDate as UpdatedNextHearingDate[]).find(
      (record) => record.offenceIndex === offenceIndex && record.resultIndex === resultIndex
    )?.updatedValue

  if (!nextHearingDateAmendment) {
    return ""
  }

  return validDateFormat.test(nextHearingDateAmendment) ? nextHearingDateAmendment : undefined
}

export default getNextHearingDateValue
