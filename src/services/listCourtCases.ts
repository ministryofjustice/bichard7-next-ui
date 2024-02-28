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
import { CaseListQueryParams } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import Permission from "types/Permission"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import Note from "./entities/Note"
import User from "./entities/User"
import filterByReasonAndResolutionStatus from "./filters/filterByReasonAndResolutionStatus"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "./queries/leftJoinAndSelectTriggersQuery"

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
  let query = repository
    .createQueryBuilder("courtCase")
    .select([
      "courtCase.errorId",
      "courtCase.triggerCount",
      "courtCase.isUrgent",
      "courtCase.asn",
      "courtCase.errorReport",
      "courtCase.errorReason",
      "courtCase.triggerReason",
      "courtCase.errorCount",
      "courtCase.errorStatus",
      "courtCase.triggerStatus",
      "courtCase.courtDate",
      "courtCase.ptiurn",
      "courtCase.courtName",
      "courtCase.resolutionTimestamp",
      "courtCase.errorResolvedBy",
      "courtCase.triggerResolvedBy",
      "courtCase.defendantName",
      "courtCase.errorLockedByUsername",
      "courtCase.triggerLockedByUsername"
    ])
  query = courtCasesByOrganisationUnitQuery(query, user) as SelectQueryBuilder<CourtCase>
  leftJoinAndSelectTriggersQuery(query, user.excludedTriggers, caseState ?? "Unresolved")
    .leftJoinAndSelect("courtCase.notes", "note")
    .leftJoin("courtCase.errorLockedByUser", "errorLockedByUser")
    .addSelect(["errorLockedByUser.forenames", "errorLockedByUser.surname"])
    .leftJoin("courtCase.triggerLockedByUser", "triggerLockedByUser")
    .addSelect(["triggerLockedByUser.forenames", "triggerLockedByUser.surname"])
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
        qb.where("trigger.trigger_code ilike :trigger", {
          trigger: reasonCode
        })
          .orWhere("courtCase.error_report ilike :firstException || '%'", {
            firstException: reasonCode + "||"
          })
          .orWhere("courtCase.error_report ilike '%' || :exception || '%'", {
            exception: " " + reasonCode + "||"
          })
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

  query = filterByReasonAndResolutionStatus(query, user, reasons, caseState, resolvedByUsername)

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

  if (!user.hasAccessTo[Permission.Triggers] && !user.hasAccessTo[Permission.Exceptions]) {
    query.andWhere("false")
  }

  if (!user.hasAccessTo[Permission.Triggers]) {
    query.andWhere({ errorCount: MoreThan(0) })
  }

  if (!user.hasAccessTo[Permission.Exceptions]) {
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
