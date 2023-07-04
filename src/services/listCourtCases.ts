import {
  Brackets,
  DataSource,
  ILike,
  IsNull,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  SelectQueryBuilder
} from "typeorm"
import { CaseListQueryParams, Reason } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import { BailCodes } from "utils/bailCodes"
import CourtCase from "./entities/CourtCase"
import Note from "./entities/Note"
import User from "./entities/User"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "./queries/leftJoinAndSelectTriggersQuery"
import { hasAccessToExceptions, hasAccessToTriggers } from "utils/userPermissions"

const listCourtCases = async (
  connection: DataSource,
  {
    pageNum,
    maxPageItems,
    orderBy,
    order,
    defendantName,
    courtName,
    ptiurn,
    reasons,
    urgent,
    courtDateRange,
    locked,
    caseState,
    allocatedToUserName,
    reasonCode,
    resolvedByUsername
  }: CaseListQueryParams,
  user: User
): PromiseResult<ListCourtCaseResult> => {
  const pageNumValidated = (pageNum ? parseInt(pageNum, 10) : 1) - 1 // -1 because the db index starts at 0
  const maxPageItemsValidated = maxPageItems ? parseInt(maxPageItems, 10) : 25
  const repository = connection.getRepository(CourtCase)
  const subquery = connection
    .getRepository(Note)
    .createQueryBuilder("notes")
    .select("COUNT(note_id)")
    .where("error_id = courtCase.errorId")
  let query = repository.createQueryBuilder("courtCase")
  query = courtCasesByOrganisationUnitQuery(query, user) as SelectQueryBuilder<CourtCase>
  leftJoinAndSelectTriggersQuery(query, user.excludedTriggers, caseState ?? "Unresolved")
    .leftJoinAndSelect("courtCase.notes", "note")
    .skip(pageNumValidated * maxPageItemsValidated)
    .take(maxPageItemsValidated)

  const sortOrder = order === "desc" ? "DESC" : "ASC"

  // Primary sorts
  if (orderBy === "reason") {
    query.orderBy("courtCase.errorReason", sortOrder).addOrderBy("courtCase.triggerReason", sortOrder)
  } else if (orderBy === "lockedBy") {
    query
      .orderBy("courtCase.errorLockedByUsername", sortOrder)
      .addOrderBy("courtCase.triggerLockedByUsername", sortOrder)
  } else if (orderBy === "isUrgent") {
    query.orderBy("courtCase.isUrgent", sortOrder === "ASC" ? "DESC" : "ASC")
  } else if (orderBy === "notes") {
    query
      .addSelect(`(${subquery.getQuery()})`, "note_count")
      .orderBy("note_count", sortOrder === "ASC" ? "ASC" : "DESC")
  } else {
    const orderByQuery = `courtCase.${orderBy ?? "errorId"}`
    query.orderBy(orderByQuery, sortOrder)
  }

  // Secondary sorts
  if (orderBy !== "courtDate") {
    query.addOrderBy("courtCase.courtDate", "DESC")
  }
  if (orderBy !== "ptiurn") {
    query.addOrderBy("courtCase.ptiurn")
  }

  // Filters
  if (defendantName) {
    const defendantNameLike = { defendantName: ILike(`%${defendantName}%`) }
    query.andWhere(defendantNameLike)
  }

  if (courtName) {
    const courtNameLike = { courtName: ILike(`%${courtName}%`) }
    query.andWhere(courtNameLike)
  }

  if (ptiurn) {
    const ptiurnLike = { ptiurn: ILike(`%${ptiurn}%`) }
    query.andWhere(ptiurnLike)
  }

  if (reasonCode) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where("trigger.trigger_code ilike '%' || :reason || '%'", {
          reason: reasonCode
        }).orWhere("courtCase.error_report ilike '%' || :reason || '%'", {
          reason: reasonCode
        })
      })
    )
  }

  if (reasons) {
    query.andWhere(
      new Brackets((qb) => {
        if (reasons?.includes(Reason.Triggers)) {
          qb.where({ triggerCount: MoreThan(0) })
        }

        if (reasons?.includes(Reason.Exceptions)) {
          qb.orWhere({ errorCount: MoreThan(0) })
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
  }

  if (urgent === "Urgent") {
    query.andWhere({ isUrgent: MoreThan(0) })
  } else if (urgent === "Non-urgent") {
    query.andWhere({ isUrgent: 0 })
  }

  if (courtDateRange) {
    if (Array.isArray(courtDateRange)) {
      query.andWhere(
        new Brackets((qb) => {
          courtDateRange.forEach((dateRange) => {
            qb.orWhere(
              new Brackets((dateRangeQuery) => {
                dateRangeQuery
                  .andWhere({ courtDate: MoreThanOrEqual(dateRange.from) })
                  .andWhere({ courtDate: LessThanOrEqual(dateRange.to) })
              })
            )
          })
        })
      )
    } else {
      query
        .andWhere({ courtDate: MoreThanOrEqual(courtDateRange.from) })
        .andWhere({ courtDate: LessThanOrEqual(courtDateRange.to) })
    }
  }

  if (!caseState || caseState === "Unresolved") {
    query.andWhere(
      new Brackets((qb) => {
        qb.where({
          resolutionTimestamp: IsNull()
        }).orWhere("trigger.status = 1")
      })
    )
  } else if (caseState === "Resolved") {
    query.andWhere({
      resolutionTimestamp: Not(IsNull())
    })

    if (resolvedByUsername !== undefined) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where({
            errorResolvedBy: resolvedByUsername
          })
            .orWhere({
              triggerResolvedBy: resolvedByUsername
            })
            .orWhere("trigger.resolvedBy = :triggerResolver", { triggerResolver: resolvedByUsername })
        })
      )
    }
  }

  if (allocatedToUserName) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where({ errorLockedByUsername: allocatedToUserName }).orWhere({
          triggerLockedByUsername: allocatedToUserName
        })
      })
    )
  }

  if (locked !== undefined) {
    if (locked) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where({ errorLockedByUsername: Not(IsNull()) }).orWhere({ triggerLockedByUsername: Not(IsNull()) })
        })
      )
    } else {
      query.andWhere(
        new Brackets((qb) => {
          qb.where({ errorLockedByUsername: IsNull() }).andWhere({ triggerLockedByUsername: IsNull() })
        })
      )
    }
  }

  if (!hasAccessToTriggers(user) && !hasAccessToExceptions(user)) {
    query.andWhere("false")
  }

  if (!hasAccessToTriggers(user)) {
    query.andWhere({ errorCount: MoreThan(0) })
  }

  if (!hasAccessToExceptions(user)) {
    query.andWhere({ triggerCount: MoreThan(0) })
  }

  const result = await query.getManyAndCount().catch((error: Error) => error)
  return isError(result)
    ? result
    : {
        result: result[0],
        totalCases: result[1]
      }
}

export default listCourtCases
