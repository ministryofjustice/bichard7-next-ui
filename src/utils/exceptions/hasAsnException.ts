import { Exception } from "types/exceptions"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

const hasAsnException = (exceptions: Exception[]): boolean =>
  exceptions.some((exception) => [ExceptionCode.HO100206, ExceptionCode.HO100321].includes(exception.code))

export default hasAsnException
