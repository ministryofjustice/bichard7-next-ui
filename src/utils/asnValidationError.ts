import { DisplayFullCourtCase } from "types/display/CourtCases"
import { AmendmentRecords } from "../types/Amendments"
import { Exception } from "../types/exceptions"
import hasAsnException from "./exceptions/hasAsnException"
import isAsnFormatValid from "./isAsnFormatValid"

const asnValidationError = (
  exceptions: Exception[],
  amendments: AmendmentRecords,
  courtCase: DisplayFullCourtCase
): boolean => {
  if (exceptions.length === 0) {
    return false
  }

  if (hasAsnException(exceptions)) {
    const originalAsn =
      courtCase.aho?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant?.ArrestSummonsNumber
    const updatedAsn =
      courtCase.updatedHearingOutcome?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant
        ?.ArrestSummonsNumber

    if (updatedAsn && originalAsn !== updatedAsn) {
      return false
    }

    return amendments.asn ? !isAsnFormatValid(amendments?.asn as string) : true
  }

  return Boolean(amendments.asn) && !isAsnFormatValid(amendments?.asn as string)
}

export default asnValidationError
