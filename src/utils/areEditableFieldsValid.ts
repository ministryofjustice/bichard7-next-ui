import { Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "../types/display/CourtCases"
import isAmendedNextHearingLocationValid from "./isAmendedNextHearingLocationValid"
import isAsnUpdated from "./isAsnUpdated"
import isNextHearingUpdated from "./isNextHearingDateUpdated"

const areEditableFieldsValid = (courtCase: DisplayFullCourtCase, amendments: Amendments): boolean => {
  const exceptions = courtCase.aho.Exceptions
  if (exceptions.length === 0) {
    return false
  }

  return (
    isNextHearingUpdated(exceptions, amendments.nextHearingDate) ||
    isAmendedNextHearingLocationValid(exceptions, amendments.nextSourceOrganisation) ||
    isAsnUpdated(exceptions, amendments.asn)
  )
}

export default areEditableFieldsValid
