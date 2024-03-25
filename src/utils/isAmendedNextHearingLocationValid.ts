import { Exception } from "../types/exceptions"
import { filterNextHearingLocationException } from "./exceptions/hasNextHearingLocationException"
import { Amendments } from "types/Amendments"

const isAmendedNextHearingLocationValid = (exceptions: Exception[], amendments: Amendments): boolean => {
  const nextHearingLocationException = filterNextHearingLocationException(exceptions)
  if (!nextHearingLocationException.length) {
    return true
  }

  const updatedNextSourceOrganisation = amendments.nextSourceOrganisation || []

  return (
    nextHearingLocationException.length === updatedNextSourceOrganisation.length &&
    !updatedNextSourceOrganisation.some((el) => !el.value?.trim())
  )
}

export default isAmendedNextHearingLocationValid
