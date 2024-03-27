import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"
import hasNextHearingDateExceptions from "./exceptions/hasNextHearingDateExceptions"
import hasNextHearingLocationException from "./exceptions/hasNextHearingLocationException"
import { EXCEPTION_OFFENCE_INDEX } from "config"

export type OffenceAlert = {
  offenceIndex: string | number
  isResolved: boolean
}

const nextHearingDateExceptionResolvedFn = (
  updatedFields: Amendments,
  exception: Exception,
  offenceIndex: number
): boolean => {
  if (hasNextHearingDateExceptions([exception])) {
    return Boolean(
      updatedFields?.nextHearingDate?.some((nextHearingDate) => nextHearingDate.offenceIndex === offenceIndex)
    )
  } else {
    return false
  }
}

const nextHearingLocationExceptionResolvedFn = (
  updatedFields: Amendments,
  exception: Exception,
  offenceIndex: number
): boolean => {
  if (hasNextHearingLocationException([exception])) {
    return Boolean(
      updatedFields?.nextSourceOrganisation?.some(
        (nextSourceOrganisation) => nextSourceOrganisation.offenceIndex === offenceIndex
      )
    )
  } else {
    return false
  }
}

const getOffenceAlertsDetails = (exceptions: Exception[], updatedFields: Amendments): OffenceAlert[] => {
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
      const existingAlert = offenceAlerts.find((alert) => alert.offenceIndex === offenceIndex)
      if (existingAlert) {
        existingAlert.isResolved = existingAlert.isResolved && isResolved
      } else {
        offenceAlerts.push({ offenceIndex, isResolved })
      }
    } else {
      offenceAlerts.push({ offenceIndex, isResolved })
    }
  })

  return offenceAlerts
}

export { nextHearingDateExceptionResolvedFn, nextHearingLocationExceptionResolvedFn }
export default getOffenceAlertsDetails
