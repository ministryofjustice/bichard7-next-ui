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
  if (shouldFilterForTriggers(user, reason)) {
    query.andWhere({ triggerResolvedTimestamp: Not(IsNull()) })
  } else if (shouldFilterForExceptions(user, reason)) {
    query.andWhere({ errorResolvedTimestamp: Not(IsNull()) })
  } else if (canSeeTriggersAndException(user, reason)) {
    query.andWhere(
      new Brackets((qb) =>
        qb.where({ errorResolvedTimestamp: Not(IsNull()) }).orWhere({ triggerResolvedTimestamp: Not(IsNull()) })
      )
    )
  }

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

const filterByReason = (
  query: SelectQueryBuilder<CourtCase>,
  reason?: Reason,
  resolvedOrUnresolved?: FindOperator<null>
): SelectQueryBuilder<CourtCase> => {
  query.andWhere(
    new Brackets((qb) => {
      if (reason === Reason.Triggers) {
        qb.where({
          triggerCount: MoreThan(0),
          triggerResolvedTimestamp: resolvedOrUnresolved
        })
      } else if (reason === Reason.Exceptions) {
        qb.where({
          errorCount: MoreThan(0),
          errorResolvedTimestamp: resolvedOrUnresolved
        })
      } else {
        qb.where({
          errorCount: MoreThan(0),
          errorResolvedTimestamp: resolvedOrUnresolved
        }).orWhere({
          triggerCount: MoreThan(0),
          triggerResolvedTimestamp: resolvedOrUnresolved
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
    query = filterByReason(query, reason, caseState === "Unresolved" ? IsNull() : Not(IsNull()))
  }

  if (caseState === "Unresolved") {
    query = filterIfUnresolved(query, user, reason)
  } else if (caseState === "Resolved") {
    query = filterIfResolved(query, user, reason, resolvedByUsername)
  }

  return query
}

export default filterByReasonAndResolutionStatus
