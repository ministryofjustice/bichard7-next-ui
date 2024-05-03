import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"
import { filterNextHearingDateExceptions } from "./exceptions/hasNextHearingDateExceptions"
import { isEmpty } from "lodash"

// TODO: nextHearingDate should be Date type
const isNextHearingDateAmended = (exceptions: Exception[], nextHearingDate: Amendments["nextHearingDate"]): boolean => {
  const nextHearingDateExceptions = filterNextHearingDateExceptions(exceptions)
  if (!nextHearingDateExceptions.length) {
    return false
  }

  const updatedNextHearingDate = nextHearingDate ?? []

  return !isEmpty(updatedNextHearingDate) && updatedNextHearingDate.some((el) => el.value?.trim())
}

export default isNextHearingDateAmended
