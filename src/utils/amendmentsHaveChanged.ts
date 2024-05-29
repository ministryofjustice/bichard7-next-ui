import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
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
  let sameNumberOfMatching = false

  if (exceptions.find((exception) => exception.code === ExceptionCode.HO100310)) {
    sameNumberOfMatching =
      amendments.offenceCourtCaseReferenceNumber?.length === amendments.offenceReasonSequence?.length
  }

  return (
    sameNumberOfMatching ||
    ((isEmpty(amendments.asn) || isAsnAmended(exceptions, amendments.asn)) &&
      (isNextHearingDateAmended(exceptions, amendments.nextHearingDate) ||
        isNextHearingLocationAmended(exceptions, amendments.nextSourceOrganisation)))
  )
}

export default amendmentsHaveChanged
