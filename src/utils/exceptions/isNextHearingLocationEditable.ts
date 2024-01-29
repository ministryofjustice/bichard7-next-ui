import { Exception } from "types/exceptions"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { DisplayFullCourtCase } from "../../types/display/CourtCases"
import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"

const isNextHearingLocationEditable = (exceptions: Exception[], courtCase: DisplayFullCourtCase): boolean => {
  const hasNextHearingLocationException = exceptions.some(
    (exception) =>
      exception.path.join(".").endsWith(".NextResultSourceOrganisation.OrganisationUnitCode") &&
      (exception.code === ExceptionCode.HO100200 ||
        exception.code === ExceptionCode.HO100300 ||
        exception.code === ExceptionCode.HO100322)
  )
  return hasNextHearingLocationException && courtCase.canUserEditExceptions && courtCase.phase === Phase.HEARING_OUTCOME
}

export default isNextHearingLocationEditable
