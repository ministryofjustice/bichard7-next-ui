import errorPaths from "@moj-bichard7-developers/bichard7-next-core/core/phase1/lib/errorPaths"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = "BAD_DATA"
  aho.Exceptions.push({
    code: ExceptionCode.HO100206,
    path: errorPaths.case.asn
  })
  return aho
}
