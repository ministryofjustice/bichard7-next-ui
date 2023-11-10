import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { Brackets, IsNull, Not, SelectQueryBuilder } from "typeorm"
import { CaseState, Reason } from "types/CaseListQueryParams"
import Permission from "types/Permission"

const canOnlySeeExceptions = (user: User): boolean =>
  user.hasAccessTo[Permission.Exceptions] && !user.hasAccessTo[Permission.Triggers]

const canOnlySeeTriggers = (user: User): boolean =>
  user.hasAccessTo[Permission.Triggers] && !user.hasAccessTo[Permission.Exceptions]

const canSeeTriggersAndException = (user: User): boolean =>
  user.hasAccessTo[Permission.Exceptions] && user.hasAccessTo[Permission.Triggers]

const userNotAllowedToFilter = (user: User, reasons: Reason[]) =>
  (canOnlySeeTriggers(user) && reasons?.includes(Reason.Exceptions)) ||
  (canOnlySeeExceptions(user) && (reasons?.includes(Reason.Triggers) || reasons?.includes(Reason.Bails)))

const filterIfUnresolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reasons: Reason[]
): SelectQueryBuilder<CourtCase> => {
  return query.andWhere({
    ...(canOnlySeeTriggers(user) || reasons?.includes(Reason.Triggers) || reasons?.includes(Reason.Bails)
      ? { triggerResolvedTimestamp: IsNull() }
      : {}),
    ...(canOnlySeeExceptions(user) || reasons?.includes(Reason.Exceptions) ? { errorResolvedTimestamp: IsNull() } : {}),
    ...(!reasons || reasons.length === 0 ? { resolutionTimestamp: IsNull() } : {})
  })
}

const filterIfResolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reasons: Reason[],
  resolvedByUsername?: string
) => {
  query.andWhere({
    ...(canOnlySeeTriggers(user) || reasons?.includes(Reason.Triggers) || reasons?.includes(Reason.Bails)
      ? {
          triggerResolvedTimestamp: Not(IsNull())
        }
      : {}),
    ...(canOnlySeeExceptions(user) || reasons?.includes(Reason.Exceptions)
      ? {
          errorResolvedTimestamp: Not(IsNull())
        }
      : {}),
    ...(canSeeTriggersAndException(user) && (!reasons || reasons.length === 0)
      ? { resolutionTimestamp: Not(IsNull()) }
      : {})
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

  if (userNotAllowedToFilter(user, reasons)) {
    query.andWhere("false")
  }

  if (caseState === "Unresolved") {
    query = filterIfUnresolved(query, user, reasons)
  } else if (caseState === "Resolved") {
    query = filterIfResolved(query, user, reasons, resolvedByUsername)
  }

  return query
}

export default filterByResolutionStatus
