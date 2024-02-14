import { Exception } from "types/exceptions"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

const hasAsnException = (exceptions: Exception[]): boolean =>
  exceptions.some((exception) => exception.code === ExceptionCode.HO100206 || exception.code === ExceptionCode.HO100321)

export default hasAsnException
