import { Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "../types/display/CourtCases"
import isAmendedNextHearingLocationValid from "./isAmendedNextHearingLocationValid"
import isAsnValid from "./isAsnValid"
import isNextHearingDateValid from "./isNextHearingDateValid"

const areEditableFieldsValid = (courtCase: DisplayFullCourtCase, amendments: Amendments): boolean => {
  const exceptions = courtCase.aho.Exceptions
  if (exceptions.length === 0) {
    return false
  }

  return (
    isNextHearingDateValid(exceptions, amendments.nextHearingDate) &&
    isAmendedNextHearingLocationValid(exceptions, amendments.nextSourceOrganisation) &&
    isAsnValid(exceptions, amendments.asn)
  )
}

export default areEditableFieldsValid
