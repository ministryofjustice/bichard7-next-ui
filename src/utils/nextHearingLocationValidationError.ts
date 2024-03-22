import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { AmendmentRecords } from "../types/Amendments"
import { Exception } from "../types/exceptions"
import hasNextHearingLocationException from "./exceptions/hasNextHearingLocationException"
import { isEmptyOrWhiteSpace } from "./isEmptyOrWhitespace"

const nextHearingLocationValidationError = (exceptions: Exception[], amendments: AmendmentRecords): boolean => {
  if (!hasNextHearingLocationException(exceptions)) {
    return false
  }

  const nextHearingLocationExceptions = [ExceptionCode.HO100200, ExceptionCode.HO100300, ExceptionCode.HO100322]
  const updatedNextSourceOrganisation = amendments.nextSourceOrganisation
  const nextHearingLocationExceptionsFromCourtCase = exceptions.filter(({ code }) =>
    nextHearingLocationExceptions.includes(code)
  )
  const updatedNextHearingLocationIsEmpty: boolean = !!updatedNextSourceOrganisation
    ?.map((el) => isEmptyOrWhiteSpace(el.updatedValue))
    .includes(true)

  return (
    nextHearingLocationExceptionsFromCourtCase.length !== updatedNextSourceOrganisation?.length ||
    updatedNextHearingLocationIsEmpty
  )
}

export default nextHearingLocationValidationError
