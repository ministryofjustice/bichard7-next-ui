import { Amendments } from "types/Amendments"
import getNextHearingDateExceptions from "./exceptions/getNextHearingDateExceptions"
import { Exception } from "types/exceptions"
import getNextHearingLocationExceptions from "./exceptions/getNextHearingLocationExceptions"
import isAsnException from "./exceptions/isException/isAsnException"
import hasNextHearingDateExceptions from "./exceptions/hasNextHearingDateExceptions"
import hasNextHearingLocationException from "./exceptions/hasNextHearingLocationException"

export type TabDetails = {
  name: "Defendant" | "Hearing" | "Case" | "Offences" | "Notes"
  exceptionsCount: number
  exceptionsResolved: boolean
}

type ExceptionDetails = {
  ExceptionsCount: number
  ExceptionsResolved: boolean
}

const getAsnExceptionDetails = (exceptions: Exception[], updatedFields: Amendments): ExceptionDetails => {
  const asnExceptionCount = +isAsnException(exceptions)
  const asnExceptionCountFromUpdatedFields = updatedFields?.asn ? 1 : 0
  return {
    ExceptionsCount: asnExceptionCount - asnExceptionCountFromUpdatedFields,
    ExceptionsResolved: asnExceptionCount > 0 && asnExceptionCount === asnExceptionCountFromUpdatedFields
  }
}

const getNextHearingDateExceptionsDetails = (exceptions: Exception[], updatedFields: Amendments): ExceptionDetails => {
  const nextHearingDateExceptionsCount = getNextHearingDateExceptions(exceptions).length
  const nextHearingDateExceptionsCountFromUpdatedFields = updatedFields?.nextHearingDate?.length || 0

  return {
    ExceptionsCount: nextHearingDateExceptionsCount - nextHearingDateExceptionsCountFromUpdatedFields,
    ExceptionsResolved:
      nextHearingDateExceptionsCount > 0 &&
      nextHearingDateExceptionsCount === nextHearingDateExceptionsCountFromUpdatedFields
  }
}

const getNextHearingLocationExceptionsDetails = (
  exceptions: Exception[],
  updatedFields: Amendments
): ExceptionDetails => {
  const nextHearingLocationExceptionsCount = getNextHearingLocationExceptions(exceptions).length
  const nextHearingLocationExceptionsCountFromUpdatedFields = updatedFields?.nextSourceOrganisation?.length || 0
  return {
    ExceptionsCount: nextHearingLocationExceptionsCount - nextHearingLocationExceptionsCountFromUpdatedFields,
    ExceptionsResolved:
      nextHearingLocationExceptionsCount > 0 &&
      nextHearingLocationExceptionsCount === nextHearingLocationExceptionsCountFromUpdatedFields
  }
}

const getTabDetails = (exceptions: Exception[], updatedFields: Amendments): TabDetails[] => {
  const nextHearingDateExceptionsDetails = getNextHearingDateExceptionsDetails(exceptions, updatedFields)
  const nextHearingLocationExceptionsDetails = getNextHearingLocationExceptionsDetails(exceptions, updatedFields)
  const asnExceptionDetails = getAsnExceptionDetails(exceptions, updatedFields)

  let offencesExceptionsResolved = false

  if (hasNextHearingDateExceptions(exceptions) && hasNextHearingLocationException(exceptions)) {
    offencesExceptionsResolved =
      nextHearingDateExceptionsDetails.ExceptionsResolved && nextHearingLocationExceptionsDetails.ExceptionsResolved
  } else if (hasNextHearingDateExceptions(exceptions)) {
    offencesExceptionsResolved = nextHearingDateExceptionsDetails.ExceptionsResolved
  } else if (hasNextHearingLocationException(exceptions)) {
    offencesExceptionsResolved = nextHearingLocationExceptionsDetails.ExceptionsResolved
  }

  return [
    {
      name: "Defendant",
      exceptionsCount: asnExceptionDetails.ExceptionsCount,
      exceptionsResolved: asnExceptionDetails.ExceptionsResolved
    },
    {
      name: "Hearing",
      exceptionsCount: 0,
      exceptionsResolved: false
    },
    {
      name: "Case",
      exceptionsCount: 0,
      exceptionsResolved: false
    },
    {
      name: "Offences",
      exceptionsCount:
        nextHearingDateExceptionsDetails.ExceptionsCount + nextHearingLocationExceptionsDetails.ExceptionsCount,
      exceptionsResolved: offencesExceptionsResolved
    },
    {
      name: "Notes",
      exceptionsCount: 0,
      exceptionsResolved: false
    }
  ]
}

export {
  getTabDetails,
  getAsnExceptionDetails,
  getNextHearingLocationExceptionsDetails,
  getNextHearingDateExceptionsDetails
}
