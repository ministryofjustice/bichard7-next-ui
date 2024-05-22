import { Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "../types/display/CourtCases"
import isAsnAmended from "./isAsnAmended"
import isNextHearingDateAmended from "./isNextHearingDateAmended"
import isNextHearingLocationAmended from "./isNextHearingLocationAmended"
import isOffenceMatchingValid from "./isOffenceMatchingValid"

const areAmendmentsValid = (courtCase: DisplayFullCourtCase, amendments: Amendments): boolean => {
  const exceptions = courtCase.aho.Exceptions
  if (exceptions.length === 0) {
    return false
  }

  return (
    isNextHearingDateAmended(exceptions, amendments.nextHearingDate) ||
    isNextHearingLocationAmended(exceptions, amendments.nextSourceOrganisation) ||
    isAsnAmended(exceptions, amendments.asn) ||
    isOffenceMatchingValid(exceptions, amendments.offenceReasonSequence)
  )
}

export default areAmendmentsValid
