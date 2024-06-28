import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

export default function (aho: AnnotatedHearingOutcome, offenceIndex = 2, resultIndex = 1): AnnotatedHearingOutcome {
  aho.Exceptions.push({
    code: ExceptionCode.HO100200,
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      offenceIndex,
      "Result",
      resultIndex,
      "NextResultSourceOrganisation",
      "OrganisationUnitCode"
    ]
  })

  return aho
}
