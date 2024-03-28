import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { Brackets, FindOperator, IsNull, MoreThan, Not, SelectQueryBuilder } from "typeorm"
import { CaseState, Reason } from "types/CaseListQueryParams"
import Permission from "types/Permission"
import { BailCodes } from "../../utils/bailCodes"

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
  return query.andWhere({
    ...(shouldFilterForTriggers(user, reasons) ? { triggerStatus: "Unresolved" } : {}),
    ...(shouldFilterForExceptions(user, reasons) ? { errorStatus: "Unresolved" } : {}),
    ...(canSeeTriggersAndException(user, reasons) ? { triggerStatus: "Unresolved", errorStatus: "Unresolved" } : {})
  })
}

const filterIfResolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reasons: Reason[],
  resolvedByUsername?: string
) => {
  query.andWhere({
    ...(shouldFilterForTriggers(user, reasons) ? { triggerStatus: "Resolved" } : {}),
    ...(shouldFilterForExceptions(user, reasons) ? { errorStatus: "Resolved" } : {}),
    ...(canSeeTriggersAndException(user, reasons) ? { triggerStatus: "Resolved", errorStatus: "Resolved" } : {})
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

const filterByReasons = (
  query: SelectQueryBuilder<CourtCase>,
  reasons: Reason[],
  resolvedOrUnresolved?: FindOperator<null>
): SelectQueryBuilder<CourtCase> => {
  query.andWhere(
    new Brackets((qb) => {
      if (reasons?.includes(Reason.Triggers)) {
        qb.where({
          triggerCount: MoreThan(0),
          triggerResolvedTimestamp: resolvedOrUnresolved
        })
      }

      if (reasons?.includes(Reason.Exceptions)) {
        qb.orWhere({
          errorCount: MoreThan(0),
          errorResolvedTimestamp: resolvedOrUnresolved
        })
      }

      if (reasons?.includes(Reason.Bails)) {
        Object.keys(BailCodes).forEach((triggerCode, i) => {
          const paramName = `bails${i}`
          qb.orWhere(`trigger.trigger_code ilike '%' || :${paramName} || '%'`, {
            [paramName]: triggerCode
          })
        })
      }
    })
  )
  return query
}

const filterByReasonAndResolutionStatus = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reasons?: Reason[],
  caseState?: CaseState,
  resolvedByUsername?: string
): SelectQueryBuilder<CourtCase> => {
  reasons = reasons ?? []
  caseState = caseState ?? "Unresolved"

  if (reasons) {
    query = filterByReasons(query, reasons, caseState === "Unresolved" ? IsNull() : Not(IsNull()))
  }

  if (caseState === "Unresolved") {
    query = filterIfUnresolved(query, user, reasons)
  } else if (caseState === "Resolved") {
    query = filterIfResolved(query, user, reasons, resolvedByUsername)
  }

  return query
}

export default filterByReasonAndResolutionStatus
