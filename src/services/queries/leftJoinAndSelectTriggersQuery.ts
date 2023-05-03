import { CaseState } from "types/CaseListQueryParams"
import CourtCase from "../entities/CourtCase"
import { SelectQueryBuilder } from "typeorm"

const getExcludedTriggers = (excludedTriggers?: string[]): string[] =>
  excludedTriggers && excludedTriggers.length > 0 ? excludedTriggers : [""]

const leftJoinAndSelectTriggersQuery = (
  query: SelectQueryBuilder<CourtCase>,
  excludedTriggers?: string[],
  caseState?: CaseState
): SelectQueryBuilder<CourtCase> => {
  query.leftJoinAndSelect(
    "courtCase.triggers",
    "trigger",
    "trigger.triggerCode NOT IN (:...excludedTriggers)" +
      (caseState === undefined || caseState === "Unresolved and resolved"
        ? ""
        : " AND trigger.status = :triggerStatus"),
    {
      excludedTriggers: getExcludedTriggers(excludedTriggers),
      triggerStatus: caseState === "Resolved" ? "2" : "1"
    }
  )
  return query
}

export default leftJoinAndSelectTriggersQuery
