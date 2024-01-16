import { Exception } from "types/exceptions"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

const hasNextHearingLocationException = (exceptions: Exception[]): boolean =>
  exceptions.some(
    (exception) =>
      exception.path.join(".").endsWith(".NextResultSourceOrganisation.OrganisationUnitCode") &&
      (exception.code === ExceptionCode.HO100200 ||
        exception.code === ExceptionCode.HO100300 ||
        exception.code === ExceptionCode.HO100322)
  )

export default hasNextHearingLocationException
