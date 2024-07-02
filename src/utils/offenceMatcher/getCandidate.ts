import type {
  HearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import generateCandidate from "@moj-bichard7-developers/bichard7-next-core/core/phase1/enrichAho/enrichFunctions/matchOffencesToPnc/generateCandidate"

import type { PncOffence } from "@moj-bichard7-developers/bichard7-next-core/core/types/PncQueryResult"
import { CaseType } from "@moj-bichard7-developers/bichard7-next-core/core/phase1/enrichAho/enrichFunctions/matchOffencesToPnc/annotatePncMatch"
const getCandidate = (
  aho: HearingOutcome,
  pncOffence: PncOffence,
  offence: Offence,
  caseReference: string
): boolean => {
  if (
    offence.ConvictionDate &&
    aho.Hearing.DateOfHearing &&
    offence.ActualOffenceStartDate.StartDate &&
    pncOffence.offence.startDate &&
    offence.ActualOffenceEndDate?.EndDate &&
    pncOffence.offence.endDate
  ) {
    offence.ConvictionDate = new Date(offence.ConvictionDate)
    aho.Hearing.DateOfHearing = new Date(aho.Hearing.DateOfHearing)
    offence.ActualOffenceStartDate.StartDate = new Date(offence.ActualOffenceStartDate.StartDate)
    pncOffence.offence.startDate = new Date(pncOffence.offence.startDate)
    offence.ActualOffenceEndDate.EndDate = new Date(offence.ActualOffenceEndDate?.EndDate)
    pncOffence.offence.endDate = new Date(pncOffence.offence.endDate)

    const candidate = generateCandidate(
      offence,
      { pncOffence, caseType: CaseType.court, caseReference },
      aho.Hearing.DateOfHearing
    )
    return Boolean(candidate)
  }
  return false
}

export default getCandidate
