import { AmendmentRecords, UpdatedNextHearingDate } from "types/Amendments"
import { Exception } from "types/exceptions"
import hasNextHearingDateException from "./exceptions/hasNextHearingDateException"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { isEmptyOrWhiteSpace } from "./isEmptyOrWhitespace"

const nextHearingDateValidationError = (exceptions: Exception[], amendments: AmendmentRecords): boolean => {
  if (!hasNextHearingDateException(exceptions)) {
    return false
  }

  const nextHearingDateExceptions = [ExceptionCode.HO100102, ExceptionCode.HO100323]
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

export default nextHearingDateValidationError
