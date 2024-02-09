import { AmendmentRecords, UpdatedNextHearingDate, UpdatedOffenceResult } from "../types/Amendments"
import { isEmptyOrWhiteSpace } from "./isEmptyOrWhitespace"
import hasNextHearingDateException from "./exceptions/hasNextHearingDateException"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import hasNextHearingLocationException from "./exceptions/hasNextHearingLocationException"
import { isAsnFormatValid } from "@moj-bichard7-developers/bichard7-next-core/core/phase1/lib/isAsnValid"
import { DisplayFullCourtCase } from "../types/display/CourtCases"
import { Exception } from "../types/exceptions"
import hasAsnException from "./exceptions/hasAsnException"

const nextHearingDateExceptions = [ExceptionCode.HO100102, ExceptionCode.HO100323]
const nextHearingLocationExceptions = [ExceptionCode.HO100200, ExceptionCode.HO100300, ExceptionCode.HO100322]

///// If there is ASN exception
// return true when field is empty
// return true when invalid value is entered

///// If there is no exception
// return false when field is empty
// return true when invalid value is entered

// if (amendments.asn) {
//   return !isAsnFormatValid(amendments?.asn as string) || isEmptyOrWhiteSpace(amendments?.asn as string)
// }
const asnValidationError = (exceptions: Exception[], amendments: AmendmentRecords): boolean => {
  if (exceptions.length === 0) {
    return false
  }

  if (hasAsnException(exceptions)) {
    return amendments.asn ? !isAsnFormatValid(amendments?.asn as string) : true
  }

  return Boolean(amendments.asn) && !isAsnFormatValid(amendments?.asn as string)
}

const nextHearingLocationValidationError = (exceptions: Exception[], amendments: AmendmentRecords): boolean => {
  if (!hasNextHearingLocationException(exceptions)) {
    return false
  }

  const updatedNextSourceOrganisation = amendments.nextSourceOrganisation as UpdatedOffenceResult[]
  const nextHearingLocationExceptionsFromCourtCase = exceptions.filter(({ code }) =>
    nextHearingLocationExceptions.includes(code)
  )
  const updatedNextHearingLocationIsEmpty: boolean = updatedNextSourceOrganisation
    ?.map((el) => isEmptyOrWhiteSpace(el.updatedValue))
    .includes(true)

  return (
    nextHearingLocationExceptionsFromCourtCase.length !== updatedNextSourceOrganisation?.length ||
    updatedNextHearingLocationIsEmpty
  )
}

const nextHearingDateValidationError = (exceptions: Exception[], amendments: AmendmentRecords): boolean => {
  if (!hasNextHearingDateException(exceptions)) {
    return false
  }

  const updatedNextHearingDate = amendments.nextHearingDate as UpdatedNextHearingDate[]
  const nextHearingDateExceptionsFromCourtCase = exceptions.filter(({ code }) =>
    nextHearingDateExceptions.includes(code)
  )
  const updatedNextHearingDateIsEmpty: boolean = updatedNextHearingDate
    ?.map((el) => isEmptyOrWhiteSpace(el.updatedValue))
    .includes(true)

  return (
    nextHearingDateExceptionsFromCourtCase.length !== updatedNextHearingDate?.length || updatedNextHearingDateIsEmpty
  )
}

const editableFieldsValidationError = (courtCase: DisplayFullCourtCase, amendments: AmendmentRecords): boolean => {
  const exceptions = courtCase.aho.Exceptions
  if (exceptions.length === 0) {
    return false
  }

  return (
    // Object.entries(amendments).length === 0 ||
    nextHearingDateValidationError(exceptions, amendments) ||
    nextHearingLocationValidationError(exceptions, amendments) ||
    asnValidationError(exceptions, amendments)
  )
}

export default editableFieldsValidationError
