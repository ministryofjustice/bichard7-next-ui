import { AmendmentRecords, UpdatedOffenceResult } from "types/Amendments"

const getNextHearingLocationValue = (
  amendmentRecords: AmendmentRecords,
  offenceIndex: number,
  resultIndex: number
): string | undefined =>
  amendmentRecords?.nextSourceOrganisation &&
  (amendmentRecords.nextSourceOrganisation as UpdatedOffenceResult[]).find(
    (record) => record.offenceIndex === offenceIndex && record.resultIndex === resultIndex
  )?.updatedValue

export default getNextHearingLocationValue
