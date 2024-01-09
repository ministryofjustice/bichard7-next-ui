import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { range } from "lodash"
import sample from "lodash.sample"

const cjsResultCodeRanges = [
  ...range(4001, 4010),
  ...range(4011, 4018),
  4020 - 4021,
  ...range(4020, 4021),
  ...range(4023, 4025),
  ...range(4027, 4035),
  ...range(4046, 4048),
  4050,
  4051,
  ...range(4053, 4058),
  4506,
  4508,
  ...range(4541, 4572),
  ...range(4574),
  ...range(4587, 4589)
]

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  const result = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0]

  if (result.NextResultSourceOrganisation) {
    result.NextResultSourceOrganisation.OrganisationUnitCode = ""
  }

  result.CJSresultCode = sample(cjsResultCodeRanges)!

  aho.Exceptions.push({
    code: ExceptionCode.HO100322,
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "Result",
      0,
      "NextResultSourceOrganisation",
      "OrganisationUnitCode"
    ]
  })

  return aho
}
