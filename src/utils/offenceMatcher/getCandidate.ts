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
  return !!generateCandidate(
    offence,
    { pncOffence, caseType: CaseType.court, caseReference },
    aho.Hearing.DateOfHearing
  )
}

export default getCandidate
