import { AmendmentRecords } from "types/Amendments"
import getNextHearingDateExceptions from "./exceptions/getNextHearingDateExceptions"
import { Exception } from "types/exceptions"
import getNextHearingLocationExceptions from "./exceptions/getNextHearingLocationExceptions"
import hasAsnException from "./exceptions/hasAsnException"
import hasNextHearingDateException from "./exceptions/hasNextHearingDateException"
import hasNextHearingLocationException from "./exceptions/hasNextHearingLocationException"

export type TabDetails = {
  name: "Defendant" | "Hearing" | "Case" | "Offences" | "Notes"
  exceptionsCount: number
  exceptionsResolved: boolean
}

const getAsnExceptionDetails = (exceptions: Exception[], updatedFields: AmendmentRecords) => {
  const asnExceptionCount = +hasAsnException(exceptions)
  const asnExceptionCountFromUpdatedFields = updatedFields?.asn ? 1 : 0
  return {
    ExceptionsCount: asnExceptionCount - asnExceptionCountFromUpdatedFields,
    ExceptionsResolved: asnExceptionCount > 0 && asnExceptionCount === asnExceptionCountFromUpdatedFields
  }
}

const getNextHearingDateExceptionsDetails = (exceptions: Exception[], updatedFields: AmendmentRecords) => {
  const nextHearingDateExceptionsCount = getNextHearingDateExceptions(exceptions).length
  const nextHearingDateExceptionsCountFromUpdatedFields = updatedFields?.nextHearingDate?.length || 0

  return {
    ExceptionsCount: nextHearingDateExceptionsCount - nextHearingDateExceptionsCountFromUpdatedFields,
    ExceptionsResolved:
      nextHearingDateExceptionsCount > 0 &&
      nextHearingDateExceptionsCount === nextHearingDateExceptionsCountFromUpdatedFields
  }
}

const getNextHearingLocationExceptionsDetails = (exceptions: Exception[], updatedFields: AmendmentRecords) => {
  const nextHearingLocationExceptionsCount = getNextHearingLocationExceptions(exceptions).length
  const nextHearingLocationExceptionsCountFromUpdatedFields = updatedFields?.nextSourceOrganisation?.length || 0
  return {
    ExceptionsCount: nextHearingLocationExceptionsCount - nextHearingLocationExceptionsCountFromUpdatedFields,
    ExceptionsResolved:
      nextHearingLocationExceptionsCount > 0 &&
      nextHearingLocationExceptionsCount === nextHearingLocationExceptionsCountFromUpdatedFields
  }
}

const getTabDetails = (exceptions: Exception[], updatedFields: AmendmentRecords): TabDetails[] => {
  const nextHearingDateExceptionsDetails = getNextHearingDateExceptionsDetails(exceptions, updatedFields)
  const nextHearingLocationExceptionsDetails = getNextHearingLocationExceptionsDetails(exceptions, updatedFields)
  const asnExceptionDetails = getAsnExceptionDetails(exceptions, updatedFields)

  let offencesExceptionsResolved = false

  if (hasNextHearingDateException(exceptions) && hasNextHearingLocationException(exceptions)) {
    offencesExceptionsResolved =
      nextHearingDateExceptionsDetails.ExceptionsResolved && nextHearingLocationExceptionsDetails.ExceptionsResolved
  } else if (hasNextHearingDateException(exceptions)) {
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
