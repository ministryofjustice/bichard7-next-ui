import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { Brackets, IsNull, Not, SelectQueryBuilder } from "typeorm"
import { CaseState, Reason } from "types/CaseListQueryParams"
import Permission from "types/Permission"

const reasonFilterOnlyIncludesTriggers = (reasons: Reason[]): boolean =>
  (reasons?.includes(Reason.Triggers) || reasons?.includes(Reason.Bails)) && !reasons?.includes(Reason.Exceptions)

const reasonFilterOnlyIncludesExceptions = (reasons: Reason[]): boolean =>
  reasons?.includes(Reason.Exceptions) && !(reasons?.includes(Reason.Triggers) || reasons?.includes(Reason.Bails))

const shouldFilterForExceptions = (user: User, reasons: Reason[]): boolean =>
  (user.hasAccessTo[Permission.Exceptions] && !user.hasAccessTo[Permission.Triggers]) ||
  reasonFilterOnlyIncludesExceptions(reasons)

const shouldFilterForTriggers = (user: User, reasons: Reason[]): boolean =>
  (user.hasAccessTo[Permission.Triggers] && !user.hasAccessTo[Permission.Exceptions]) ||
  reasonFilterOnlyIncludesTriggers(reasons)

const canSeeTriggersAndException = (user: User, reasons: Reason[]): boolean =>
  user.hasAccessTo[Permission.Exceptions] &&
  user.hasAccessTo[Permission.Triggers] &&
  (!reasons ||
    reasons.length === 0 ||
    (reasons?.includes(Reason.Exceptions) && reasons?.includes(Reason.Triggers) && reasons?.includes(Reason.Bails)))

const filterIfUnresolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reasons: Reason[]
): SelectQueryBuilder<CourtCase> => {
  console.log("shouldFilterForTriggers(user, reasons)", shouldFilterForTriggers(user, reasons))
  console.log("shouldFilterForExceptions(user, reasons)", shouldFilterForExceptions(user, reasons))
  console.log("canSeeTriggersAndException(user, reasons)", canSeeTriggersAndException(user, reasons))

  return query.andWhere({
    ...(shouldFilterForTriggers(user, reasons) ? { triggerResolvedTimestamp: IsNull() } : {}),
    ...(shouldFilterForExceptions(user, reasons) ? { errorResolvedTimestamp: IsNull() } : {}),
    ...(canSeeTriggersAndException(user, reasons) ? { resolutionTimestamp: IsNull() } : {})
  })
}

const filterIfResolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reasons: Reason[],
  resolvedByUsername?: string
) => {
  query.andWhere({
    ...(shouldFilterForTriggers(user, reasons) ? { triggerResolvedTimestamp: Not(IsNull()) } : {}),
    ...(shouldFilterForExceptions(user, reasons) ? { errorResolvedTimestamp: Not(IsNull()) } : {}),
    ...(canSeeTriggersAndException(user, reasons) ? { resolutionTimestamp: Not(IsNull()) } : {})
  })

  if (resolvedByUsername || !user.hasAccessTo[Permission.ListAllCases]) {
    query.andWhere(
      new Brackets((qb) => {
        if (reasonFilterOnlyIncludesTriggers(reasons)) {
          qb.where({
            triggerResolvedBy: resolvedByUsername ?? user.username
          })
        } else if (reasonFilterOnlyIncludesExceptions(reasons)) {
          qb.where({
            errorResolvedBy: resolvedByUsername ?? user.username
          })
        } else {
          qb.where({
            errorResolvedBy: resolvedByUsername ?? user.username
          })
            .orWhere({
              triggerResolvedBy: resolvedByUsername ?? user.username
            })
            .orWhere("trigger.resolvedBy = :triggerResolver", {
              triggerResolver: resolvedByUsername ?? user.username
            })
        }
      })
    )
  }
  return query
}

const filterByResolutionStatus = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reasons?: Reason[],
  caseState?: CaseState,
  resolvedByUsername?: string
): SelectQueryBuilder<CourtCase> => {
  reasons = reasons ?? []
  caseState = caseState ?? "Unresolved"

  if (caseState === "Unresolved") {
    query = filterIfUnresolved(query, user, reasons)
  } else if (caseState === "Resolved") {
    query = filterIfResolved(query, user, reasons, resolvedByUsername)
  }

  return query
}

export default filterByResolutionStatus
