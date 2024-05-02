import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"
import { filterNextHearingDateExceptions } from "./exceptions/hasNextHearingDateExceptions"
import { isEmpty } from "lodash"
// TODO: nextHearingDate should be Date type
const isNextHearingDateUpdated = (exceptions: Exception[], nextHearingDate: Amendments["nextHearingDate"]): boolean => {
  const nextHearingDateExceptions = filterNextHearingDateExceptions(exceptions)
  if (!nextHearingDateExceptions.length) {
    return true
  }
  const updatedNextHearingDate = nextHearingDate ?? []

  console.log(updatedNextHearingDate.some((el) => !el.value?.trim()))

  return !isEmpty(updatedNextHearingDate) && !updatedNextHearingDate.some((el) => !el.value?.trim())
}

export default isNextHearingDateUpdated
