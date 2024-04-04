import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { Brackets, FindOperator, IsNull, MoreThan, Not, SelectQueryBuilder } from "typeorm"
import { CaseState, Reason } from "types/CaseListQueryParams"
import Permission from "types/Permission"

const reasonFilterOnlyIncludesTriggers = (reason?: Reason): boolean => reason === Reason.Triggers

const reasonFilterOnlyIncludesExceptions = (reason?: Reason): boolean => reason === Reason.Exceptions

const shouldFilterForExceptions = (user: User, reason?: Reason): boolean =>
  (user.hasAccessTo[Permission.Exceptions] && !user.hasAccessTo[Permission.Triggers]) ||
  reasonFilterOnlyIncludesExceptions(reason)

const shouldFilterForTriggers = (user: User, reason?: Reason): boolean =>
  (user.hasAccessTo[Permission.Triggers] && !user.hasAccessTo[Permission.Exceptions]) ||
  reasonFilterOnlyIncludesTriggers(reason)

const canSeeTriggersAndException = (user: User, reason?: Reason): boolean =>
  user.hasAccessTo[Permission.Exceptions] &&
  user.hasAccessTo[Permission.Triggers] &&
  reason !== Reason.Triggers &&
  reason !== Reason.Exceptions

const filterIfUnresolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reason?: Reason
): SelectQueryBuilder<CourtCase> => {
  return query.andWhere({
    ...(shouldFilterForTriggers(user, reason) ? { triggerResolvedTimestamp: IsNull() } : {}),
    ...(shouldFilterForExceptions(user, reason) ? { errorResolvedTimestamp: IsNull() } : {}),
    ...(canSeeTriggersAndException(user, reason) ? { resolutionTimestamp: IsNull() } : {})
  })
}

const filterIfResolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reason?: Reason,
  resolvedByUsername?: string
) => {
  query.andWhere({
    ...(shouldFilterForTriggers(user, reason) ? { triggerResolvedTimestamp: Not(IsNull()) } : {}),
    ...(shouldFilterForExceptions(user, reason) ? { errorResolvedTimestamp: Not(IsNull()) } : {}),
    ...(canSeeTriggersAndException(user, reason) ? { resolutionTimestamp: Not(IsNull()) } : {})
  })

  if (resolvedByUsername || !user.hasAccessTo[Permission.ListAllCases]) {
    query.andWhere(
      new Brackets((qb) => {
        if (reasonFilterOnlyIncludesTriggers(reason)) {
          qb.where({
            triggerResolvedBy: resolvedByUsername ?? user.username
          })
        } else if (reasonFilterOnlyIncludesExceptions(reason)) {
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

const filterByReasons = (
  query: SelectQueryBuilder<CourtCase>,
  reason?: Reason,
  resolvedOrUnresolved?: FindOperator<null>
): SelectQueryBuilder<CourtCase> => {
  query.andWhere(
    new Brackets((qb) => {
      if (reason?.includes(Reason.Triggers)) {
        qb.where({
          triggerCount: MoreThan(0),
          triggerResolvedTimestamp: resolvedOrUnresolved
        })
      }

      if (reason?.includes(Reason.Exceptions)) {
        qb.orWhere({
          errorCount: MoreThan(0),
          errorResolvedTimestamp: resolvedOrUnresolved
        })
      }
    })
  )
  return query
}

const filterByReasonAndResolutionStatus = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reason?: Reason,
  caseState?: CaseState,
  resolvedByUsername?: string
): SelectQueryBuilder<CourtCase> => {
  caseState = caseState ?? "Unresolved"

  if (reason) {
    query = filterByReasons(query, reason, caseState === "Unresolved" ? IsNull() : Not(IsNull()))
  }

  if (caseState === "Unresolved") {
    query = filterIfUnresolved(query, user, reason)
  } else if (caseState === "Resolved") {
    query = filterIfResolved(query, user, reason, resolvedByUsername)
  }

  return query
}

export default filterByReasonAndResolutionStatus
