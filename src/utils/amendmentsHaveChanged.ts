import { isEmpty } from "lodash"
import { Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "../types/display/CourtCases"
import isAsnAmended from "./isAsnAmended"
import isNextHearingDateAmended from "./isNextHearingDateAmended"
import isNextHearingLocationAmended from "./isNextHearingLocationAmended"

const amendmentsHaveChanged = (courtCase: DisplayFullCourtCase, amendments: Amendments): boolean => {
  if (isEmpty(amendments)) {
    return true
  }

  const exceptions = courtCase.aho.Exceptions

  return (
    isAsnAmended(exceptions, amendments.asn) ||
    isNextHearingDateAmended(exceptions, amendments.nextHearingDate) ||
    isNextHearingLocationAmended(exceptions, amendments.nextSourceOrganisation)
  )
}

export default amendmentsHaveChanged
