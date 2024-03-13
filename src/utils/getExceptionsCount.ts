import { AmendmentRecords } from "types/Amendments"
import getNextHearingDateExceptions from "./exceptions/getNextHearingDateExceptions"
import { Exception } from "types/exceptions"
import getNextHearingLocationExceptions from "./exceptions/getNextHearingLocationExceptions"
import hasAsnException from "./exceptions/hasAsnException"

export type ExceptionIconDetails = {
  tab: "Defendant" | "Hearing" | "Case" | "Offences" | "Notes"
  exceptionsCount: number
}

const getNextHearingDateExceptionsCount = (exceptions: Exception[], updatedFields: AmendmentRecords): number => {
  const nextHearingDateExceptionsCount = getNextHearingDateExceptions(exceptions).length
  const nextHearingDateExceptionsCountFromUpdatedFields = updatedFields?.nextHearingDate?.length || 0
  return nextHearingDateExceptionsCount - nextHearingDateExceptionsCountFromUpdatedFields
}

const getNextHearingLocationExceptionsCount = (exceptions: Exception[], updatedFields: AmendmentRecords): number => {
  const nextHearingLocationExceptionsCount = getNextHearingLocationExceptions(exceptions).length
  const nextHearingLocationExceptionsCountFromUpdatedFields = updatedFields?.nextSourceOrganisation?.length || 0
  return nextHearingLocationExceptionsCount - nextHearingLocationExceptionsCountFromUpdatedFields
}

const getAsnExceptionCount = (exceptions: Exception[], updatedFields: AmendmentRecords): number => {
  const asnExceptionCount = +hasAsnException(exceptions)
  const asnExceptionCountFromUpdatedFields = updatedFields?.asn ? 1 : 0
  return asnExceptionCount - asnExceptionCountFromUpdatedFields
}

const getExceptionsCount = (exceptions: Exception[], updatedFields: AmendmentRecords): ExceptionIconDetails[] => {
  const nextHearingDateExceptionsCount = getNextHearingDateExceptionsCount(exceptions, updatedFields)
  const nextHearingLocationExceptionsCount = getNextHearingLocationExceptionsCount(exceptions, updatedFields)
  const asnExceptionCount = getAsnExceptionCount(exceptions, updatedFields)

  return [
    { tab: "Defendant", exceptionsCount: asnExceptionCount },
    { tab: "Offences", exceptionsCount: nextHearingDateExceptionsCount + nextHearingLocationExceptionsCount }
  ]
}

export default getExceptionsCount
