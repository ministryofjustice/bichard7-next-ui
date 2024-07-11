import { CaseType } from "@moj-bichard7-developers/bichard7-next-core/core/phase1/enrichAho/enrichFunctions/matchOffencesToPnc/annotatePncMatch"
import generateCandidate from "@moj-bichard7-developers/bichard7-next-core/core/phase1/enrichAho/enrichFunctions/matchOffencesToPnc/generateCandidate"
import { PncCourtCase, PncOffence } from "@moj-bichard7-developers/bichard7-next-core/core/types/PncQueryResult"
import { Candidates } from "../../types/OffenceMatching"
import { DisplayFullCourtCase } from "../../types/display/CourtCases"

const findCandidates = (courtCase: DisplayFullCourtCase, offenceIndex: number): Candidates[] => {
  if (!courtCase?.aho?.PncQuery?.courtCases) {
    return []
  }

  const offence = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex]
  const candiates = courtCase.aho.PncQuery.courtCases
    .map((c: PncCourtCase) => {
      const matchForThisCase = c.offences.filter(
        (pncOffence: PncOffence) =>
          !!generateCandidate(
            offence,
            { pncOffence, caseType: CaseType.court, caseReference: c.courtCaseReference },
            courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
          )
      )
      if (matchForThisCase.length > 0) {
        return {
          courtCaseReference: c.courtCaseReference,
          offences: matchForThisCase
        }
      }
    })
    .filter((e: Error) => !!e)

  return candiates as Candidates[]
}

export default findCandidates
