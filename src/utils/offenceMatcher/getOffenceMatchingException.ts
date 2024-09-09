import errorPaths from "@moj-bichard7-developers/bichard7-next-core/core/lib/exceptions/errorPaths"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { isEqual } from "lodash"
import { Exception } from "types/exceptions"
import { ExceptionBadgeType } from "../exceptions/exceptionBadgeType"
import offenceMatchingExceptions from "./offenceMatchingExceptions"

const getOffenceReasonSequencePath = (offenceIndex: number) => errorPaths.offence(offenceIndex).reasonSequence

type GetOffenceMatchingExceptionResult =
  | {
      code: ExceptionCode
      badge: ExceptionBadgeType.AddedByCourt | ExceptionBadgeType.Unmatched
    }
  | undefined

const getOffenceMatchingException = (
  exceptions: Exception[],
  offenceIndex: number
): GetOffenceMatchingExceptionResult => {
  const offenceMatchingException = exceptions.find((exception) => {
    const sequencePath = getOffenceReasonSequencePath(offenceIndex)

    const exceptionPath = exception.path.slice(exception.path.indexOf("HearingOutcome"))
    const hearingOutcomePath = sequencePath.slice(sequencePath.indexOf("HearingOutcome"))

    return (
      offenceMatchingExceptions.noOffencesMatched.includes(exception.code) ||
      (offenceMatchingExceptions.offenceNotMatched.includes(exception.code) &&
        isEqual(exceptionPath, hearingOutcomePath))
    )
  })

  if (!offenceMatchingException) {
    return undefined
  }

  return {
    code: offenceMatchingException.code,
    badge:
      offenceMatchingException.code === ExceptionCode.HO100507
        ? ExceptionBadgeType.AddedByCourt
        : ExceptionBadgeType.Unmatched
  }
}

export default getOffenceMatchingException
export type { GetOffenceMatchingExceptionResult }
