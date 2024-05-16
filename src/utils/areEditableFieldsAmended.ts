import { Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "../types/display/CourtCases"
import isNextHearingLocationAmended from "./isNextHearingLocationAmended"
import isAsnAmended from "./isAsnAmended"
import isNextHearingDateAmended from "./isNextHearingDateAmended"

const areEditableFieldsAmended = (courtCase: DisplayFullCourtCase, amendments: Amendments): boolean => {
  const exceptions = courtCase.aho.Exceptions
  if (exceptions.length === 0) {
    return false
  }

  return (
    isNextHearingDateAmended(exceptions, amendments.nextHearingDate) ||
    isNextHearingLocationAmended(exceptions, amendments.nextSourceOrganisation) ||
    isAsnAmended(exceptions, amendments.asn)
  )
}

export default areEditableFieldsAmended
