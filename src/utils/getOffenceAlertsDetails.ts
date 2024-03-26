import { AmendmentRecords, UpdatedNextHearingDate } from "types/Amendments"
import { Exception } from "types/exceptions"
import hasNextHearingDateException from "./exceptions/hasNextHearingDateException"
import hasNextHearingLocationException from "./exceptions/hasNextHearingLocationException"
import { EXCEPTION_OFFENCE_INDEX } from "config"

export type OffenceAlert = {
  offenceIndex: string | number
  isResolved: boolean
}

const nextHearingDateExceptionResolvedFn = (
  updatedFields: AmendmentRecords,
  exception: Exception,
  offenceIndex: number
): boolean => {
  if (hasNextHearingDateException([exception])) {
    return Boolean(
      (updatedFields?.nextHearingDate as UpdatedNextHearingDate[])?.some(
        (nextHearingDate) => nextHearingDate.offenceIndex === offenceIndex
      )
    )
  } else {
    return false
  }
}

const nextHearingLocationExceptionResolvedFn = (
  updatedFields: AmendmentRecords,
  exception: Exception,
  offenceIndex: number
): boolean => {
  if (hasNextHearingLocationException([exception])) {
    return Boolean(
      (updatedFields?.nextSourceOrganisation as UpdatedNextHearingDate[])?.some(
        (nextSourceOrganisation) => nextSourceOrganisation.offenceIndex === offenceIndex
      )
    )
  } else {
    return false
  }
}

const getOffenceAlertsDetails = (exceptions: Exception[], updatedFields: AmendmentRecords): OffenceAlert[] => {
  const offenceAlerts: OffenceAlert[] = []

  exceptions.forEach((exception) => {
    const offenceIndex = exception.path[EXCEPTION_OFFENCE_INDEX]
    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(updatedFields, exception, +offenceIndex)
    const nextHearingLocationExceptionResolved = nextHearingLocationExceptionResolvedFn(
      updatedFields,
      exception,
      +offenceIndex
    )
    const isResolved = nextHearingDateExceptionResolved || nextHearingLocationExceptionResolved

    if (offenceAlerts.length > 1) {
      offenceAlerts.find((offenceAlert, index) => {
        if (offenceAlert.offenceIndex === offenceIndex) {
          offenceAlerts[index] = { offenceIndex, isResolved: offenceAlert.isResolved && isResolved }
        }
      })
    } else {
      offenceAlerts.push({
        offenceIndex,
        isResolved
      })
    }
  })

  return offenceAlerts
}

export { nextHearingDateExceptionResolvedFn, nextHearingLocationExceptionResolvedFn }
export default getOffenceAlertsDetails
