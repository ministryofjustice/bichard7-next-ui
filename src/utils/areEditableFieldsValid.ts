import { Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "../types/display/CourtCases"
import isAsnValid from "./isAsnValid"
import isNextHearingDateValid from "./isNextHearingDateValid"
import isAmendedNextHearingLocationValid from "./isAmendedNextHearingLocationValid"

const areEditableFieldsValid = (courtCase: DisplayFullCourtCase, amendments: Amendments): boolean => {
  const exceptions = courtCase.aho.Exceptions
  if (exceptions.length === 0) {
    return false
  }

  return (
    isNextHearingDateValid(exceptions, amendments) &&
    isAmendedNextHearingLocationValid(exceptions, amendments) &&
    isAsnValid(amendments)
  )
}

export default areEditableFieldsValid
