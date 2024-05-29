import { isEmpty } from "lodash"
import { Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "../types/display/CourtCases"
import isAsnAmended from "./exceptions/isAsnAmended"
import isNextHearingDateAmended from "./exceptions/isNextHearingDateAmended"
import isNextHearingLocationAmended from "./exceptions/isNextHearingLocationAmended"

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
