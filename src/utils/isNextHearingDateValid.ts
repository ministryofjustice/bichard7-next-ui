import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"
import { filterNextHearingDateExceptions } from "./exceptions/hasNextHearingDateExceptions"

const isNextHearingDateValid = (exceptions: Exception[], nextHearingDate: Amendments["nextHearingDate"]): boolean => {
  const nextHearingDateExceptions = filterNextHearingDateExceptions(exceptions)
  if (!nextHearingDateExceptions.length) {
    return true
  }

  const updatedNextHearingDate = nextHearingDate ?? []

  return (
    nextHearingDateExceptions.length === updatedNextHearingDate.length &&
    !updatedNextHearingDate.some((el) => !el.value?.trim())
  )
}

export default isNextHearingDateValid
