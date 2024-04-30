import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"

// TODO: currently only accounts for 310s
const isOffenceMatchingValid = (exceptions: Exception[], offences: Amendments["offenceReasonSequence"]) => {
  const offenceMatchingExceptions = exceptions.filter((e) => e.code === ExceptionCode.HO100310)
  if (!offenceMatchingExceptions.length) {
    return true
  }

  if (!offences?.length || offenceMatchingExceptions.length !== offences.length) {
    return false
  }

  return true
}

export default isOffenceMatchingValid
