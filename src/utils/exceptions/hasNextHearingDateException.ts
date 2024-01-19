import { Exception } from "types/exceptions"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

const hasNextHearingDateException = (exceptions: Exception[]): boolean =>
  exceptions.some(
    (exception) =>
      exception.path.join(".").endsWith(".NextHearingDate") &&
      (exception.code === ExceptionCode.HO100102 || exception.code === ExceptionCode.HO100323)
  )

export default hasNextHearingDateException
