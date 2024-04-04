import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { Brackets, FindOperator, IsNull, Not, SelectQueryBuilder } from "typeorm"
import { CaseState, RecordType } from "types/CaseListQueryParams"
import Permission from "types/Permission"

const recordTypeFilterOnlyIncludesTriggers = (recordType?: RecordType | null): boolean =>
  recordType == RecordType.Triggers

const recordTypeFilterOnlyIncludesExceptions = (recordType?: RecordType | null): boolean =>
  recordType == RecordType.Exceptions

const shouldFilterForExceptions = (user: User, recordType?: RecordType | null): boolean =>
  (user.hasAccessTo[Permission.Exceptions] && !user.hasAccessTo[Permission.Triggers]) ||
  recordTypeFilterOnlyIncludesExceptions(recordType)

const shouldFilterForTriggers = (user: User, recordType?: RecordType | null): boolean =>
  (user.hasAccessTo[Permission.Triggers] && !user.hasAccessTo[Permission.Exceptions]) ||
  recordTypeFilterOnlyIncludesTriggers(recordType)

const canSeeTriggersAndException = (user: User, recordType?: RecordType | null): boolean =>
  user.hasAccessTo[Permission.Exceptions] && user.hasAccessTo[Permission.Triggers] && recordType === undefined

const filterIfUnresolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  recordType?: RecordType | null
): SelectQueryBuilder<CourtCase> => {
  if (shouldFilterForTriggers(user, recordType)) {
    query.andWhere({ triggerStatus: "Unresolved" })
  } else if (shouldFilterForExceptions(user, recordType)) {
    query.andWhere({ errorStatus: "Unresolved" })
  } else if (canSeeTriggersAndException(user, recordType)) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where({ triggerStatus: "Unresolved" }).orWhere({ errorStatus: "Unresolved" })
      })
    )
  }
  return query
}

const filterIfResolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  recordType?: RecordType | null,
  resolvedByUsername?: string
) => {
  if (shouldFilterForTriggers(user, recordType)) {
    query.andWhere({ triggerStatus: "Resolved" })
  } else if (shouldFilterForExceptions(user, recordType)) {
    query.andWhere({ errorStatus: "Resolved" })
  } else if (canSeeTriggersAndException(user, recordType)) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where({ triggerStatus: Not("Unresolved") }).andWhere({ errorStatus: Not("Unresolved") })
      })
    )
  }

  if (resolvedByUsername || !user.hasAccessTo[Permission.ListAllCases]) {
    query.andWhere(
      new Brackets((qb) => {
        if (recordTypeFilterOnlyIncludesTriggers(recordType)) {
          qb.where({
            triggerResolvedBy: resolvedByUsername ?? user.username
          })
        } else if (recordTypeFilterOnlyIncludesExceptions(recordType)) {
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
  reason: RecordType,
  resolvedOrUnresolved?: FindOperator<null>
): SelectQueryBuilder<CourtCase> => {
  console.log(null && resolvedOrUnresolved)
  query.andWhere(
    new Brackets((qb) => {
      if (reason === RecordType.Triggers) {
        qb.where({
          triggerStatus: Not(null),
          triggerResolvedTimestamp: resolvedOrUnresolved
        })
      }

      if (reason === RecordType.Exceptions) {
        qb.orWhere({
          errorStatus: Not(null),
          errorResolvedTimestamp: resolvedOrUnresolved
        })
      }

      // if (reasons?.includes(Reason.Bails)) {
      //   Object.keys(BailCodes).forEach((triggerCode, i) => {
      //     const paramName = `bails${i}`
      //     qb.orWhere(`trigger.trigger_code ilike '%' || :${paramName} || '%'`, {
      //       [paramName]: triggerCode
      //     })
      //   })
      // }
    })
  )
  return query
}

const filterByReasonAndResolutionStatus = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  recordType?: RecordType | null,
  caseState?: CaseState,
  resolvedByUsername?: string
): SelectQueryBuilder<CourtCase> => {
  caseState = caseState ?? "Unresolved"

  if (recordType) {
    query = filterByReason(query, recordType, caseState === "Unresolved" ? IsNull() : Not(IsNull()))
  }

  if (caseState === "Unresolved") {
    query = filterIfUnresolved(query, user, recordType)
  } else if (caseState === "Resolved") {
    query = filterIfResolved(query, user, recordType, resolvedByUsername)
  }

  return query
}

export default filterByReasonAndResolutionStatus
