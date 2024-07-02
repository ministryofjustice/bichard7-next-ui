import type {
  HearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import generateCandidate from "@moj-bichard7-developers/bichard7-next-core/core/phase1/enrichAho/enrichFunctions/matchOffencesToPnc/generateCandidate"
import type { PncOffence } from "@moj-bichard7-developers/bichard7-next-core/core/types/PncQueryResult"
import { CaseType } from "@moj-bichard7-developers/bichard7-next-core/core/phase1/enrichAho/enrichFunctions/matchOffencesToPnc/annotatePncMatch"

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

const parseJsonObjectWithDates = (jsonObject: HearingOutcome | PncOffence | Offence) =>
  JSON.parse(JSON.stringify(jsonObject), (_, value) => {
    return typeof value === "string" && dateFormatRegex.test(value) ? new Date(value) : value
  })

const getCandidate = (
  aho: HearingOutcome,
  pncOffence: PncOffence,
  offence: Offence,
  caseReference: string
): boolean => {
  const candidate = generateCandidate(
    parseJsonObjectWithDates(offence),
    { pncOffence: parseJsonObjectWithDates(pncOffence), caseType: CaseType.court, caseReference },
    parseJsonObjectWithDates(aho).Hearing.DateOfHearing
  )
  return Boolean(candidate)
}

export default getCandidate
