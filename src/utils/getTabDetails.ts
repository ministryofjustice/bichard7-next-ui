import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"
import getNextHearingDateExceptions from "./exceptions/getNextHearingDateExceptions"
import getNextHearingLocationExceptions from "./exceptions/getNextHearingLocationExceptions"
import hasNextHearingDateExceptions from "./exceptions/hasNextHearingDateExceptions"
import hasNextHearingLocationException from "./exceptions/hasNextHearingLocationException"
import isAsnException from "./exceptions/isException/isAsnException"
import isAsnFormatValid from "./isAsnFormatValid"

export type TabDetails = {
  name: "Defendant" | "Hearing" | "Case" | "Offences" | "Notes"
  exceptionsCount: number
  exceptionsResolved: boolean
}

type ExceptionDetails = {
  ExceptionsCount: number
  ExceptionsResolved: boolean
}

const getAsnExceptionDetails = (
  exceptions: Exception[],
  updatedFields: Amendments,
  savedAmendments: Amendments
): ExceptionDetails => {
  const asnExceptionCount = +isAsnException(exceptions)

  let saved: boolean = false

  if (savedAmendments?.asn) {
    saved = true
  }

  const asnExceptionCountFromUpdatedFields =
    saved && isAsnFormatValid(updatedFields?.asn ?? "") && savedAmendments.asn === updatedFields.asn ? 1 : 0

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
  savedAmendments: Amendments
): ExceptionDetails => {
  const nextHearingLocationExceptionsCount = getNextHearingLocationExceptions(exceptions).length
  const nextHearingLocationExceptionsCountFromUpdatedFields = savedAmendments?.nextSourceOrganisation?.length || 0
  return {
    ExceptionsCount: nextHearingLocationExceptionsCount - nextHearingLocationExceptionsCountFromUpdatedFields,
    ExceptionsResolved:
      nextHearingLocationExceptionsCount > 0 &&
      nextHearingLocationExceptionsCount === nextHearingLocationExceptionsCountFromUpdatedFields
  }
}

const getTabDetails = (
  exceptions: Exception[],
  updatedFields: Amendments,
  savedAmendments: Amendments
): TabDetails[] => {
  const nextHearingDateExceptionsDetails = getNextHearingDateExceptionsDetails(exceptions, updatedFields)
  const nextHearingLocationExceptionsDetails = getNextHearingLocationExceptionsDetails(exceptions, savedAmendments)
  const asnExceptionDetails = getAsnExceptionDetails(exceptions, updatedFields, savedAmendments)

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
  getAsnExceptionDetails,
  getNextHearingDateExceptionsDetails,
  getNextHearingLocationExceptionsDetails,
  getTabDetails
}
