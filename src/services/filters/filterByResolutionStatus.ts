import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { Brackets, IsNull, Not, SelectQueryBuilder } from "typeorm"
import { CaseState, Reason } from "types/CaseListQueryParams"
import Permission from "types/Permission"

const shouldFilterForExceptions = (user: User, reasons: Reason[]): boolean =>
  (user.hasAccessTo[Permission.Exceptions] && !user.hasAccessTo[Permission.Triggers]) ||
  reasons?.includes(Reason.Exceptions)

const shouldFilterForTriggers = (user: User, reasons: Reason[]): boolean =>
  (user.hasAccessTo[Permission.Triggers] && !user.hasAccessTo[Permission.Exceptions]) ||
  reasons?.includes(Reason.Triggers) ||
  reasons?.includes(Reason.Bails)

const canSeeTriggersAndException = (user: User, reasons: Reason[]): boolean =>
  user.hasAccessTo[Permission.Exceptions] && user.hasAccessTo[Permission.Triggers] && (!reasons || reasons.length === 0)

const filterIfUnresolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reasons: Reason[]
): SelectQueryBuilder<CourtCase> => {
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
        if (reasons?.includes(Reason.Triggers) || reasons?.includes(Reason.Bails)) {
          qb.where({
            triggerResolvedBy: resolvedByUsername ?? user.username
          })
        } else if (reasons?.includes(Reason.Exceptions)) {
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
