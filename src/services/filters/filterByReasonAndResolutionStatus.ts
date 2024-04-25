import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { Brackets, IsNull, Not, SelectQueryBuilder } from "typeorm"
import { CaseState, Reason } from "types/CaseListQueryParams"
import Permission from "types/Permission"

const reasonFilterOnlyIncludesTriggers = (reason?: Reason): boolean => reason === Reason.Triggers

const reasonFilterOnlyIncludesExceptions = (reason?: Reason): boolean => reason === Reason.Exceptions

const shouldFilterForExceptions = (user: User, reason?: Reason): boolean =>
  (user.hasAccessTo[Permission.Exceptions] && !user.hasAccessTo[Permission.Triggers]) ||
  (user.hasAccessTo[Permission.Exceptions] && reasonFilterOnlyIncludesExceptions(reason))

const shouldFilterForTriggers = (user: User, reason?: Reason): boolean =>
  (user.hasAccessTo[Permission.Triggers] && !user.hasAccessTo[Permission.Exceptions]) ||
  (user.hasAccessTo[Permission.Triggers] && reasonFilterOnlyIncludesTriggers(reason))

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
  if (shouldFilterForTriggers(user, reason)) {
    query.andWhere({ triggerStatus: "Unresolved" })
  } else if (shouldFilterForExceptions(user, reason)) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where({ errorStatus: "Unresolved" }).orWhere({ errorStatus: "Submitted" })
      })
    )
  } else if (canSeeTriggersAndException(user, reason)) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where({ triggerStatus: "Unresolved" }).orWhere(
          new Brackets((qb2) => {
            qb2.where({ errorStatus: "Unresolved" }).orWhere({ errorStatus: "Submitted" })
          })
        )
      })
    )
  }
  return query
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
    query.andWhere({ errorStatus: "Resolved" })
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

const filterByReasonAndResolutionStatus = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reason?: Reason,
  caseState?: CaseState,
  resolvedByUsername?: string
): SelectQueryBuilder<CourtCase> => {
  caseState = caseState ?? "Unresolved"

  if (caseState === "Unresolved") {
    query = filterIfUnresolved(query, user, reason)
  } else if (caseState === "Resolved") {
    query = filterIfResolved(query, user, reason, resolvedByUsername)
  }

  return query
}

export default filterByReasonAndResolutionStatus
