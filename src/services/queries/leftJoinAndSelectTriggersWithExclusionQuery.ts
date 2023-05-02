import { CaseState } from "types/CaseListQueryParams"
import CourtCase from "../entities/CourtCase"
import { SelectQueryBuilder } from "typeorm"

const leftJoinAndSelectTriggersWithExclusionQuery = (
  query: SelectQueryBuilder<CourtCase>,
  excludedTriggers?: string[],
  caseState?: CaseState
): SelectQueryBuilder<CourtCase> => {
  query.leftJoinAndSelect(
    "courtCase.triggers",
    "trigger",
    "trigger.triggerCode NOT IN (:...excludedTriggers)" +
      (caseState === "Unresolved and resolved" ? "" : " AND trigger.status = :triggerStatus"),
    {
      excludedTriggers: excludedTriggers ?? [""],
      triggerStatus: caseState === "Resolved" ? "2" : "1"
    }
  )
  return query
}

export default leftJoinAndSelectTriggersWithExclusionQuery
