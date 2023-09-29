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
import Feature from "types/Feature"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import { BailCodes } from "utils/bailCodes"
import CourtCase from "./entities/CourtCase"
import Note from "./entities/Note"
import User from "./entities/User"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"

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

  const noteCountSubquery = connection
    .getRepository(Note)
    .createQueryBuilder("notes")
    .select("COUNT(note_id)")
    .where("error_id = courtCase.errorId AND user_id != 'system'")

  const mostRecentNoteTextSubquery = connection
    .getRepository(Note)
    .createQueryBuilder("notes")
    .select("note_text")
    .where("error_id = courtCase.errorId AND user_id != 'system'")
    .orderBy("create_ts", "DESC")
    .limit(1)

  const mostRecentNoteDateSubquery = connection
    .getRepository(Note)
    .createQueryBuilder("notes")
    .select("create_ts")
    .where("error_id = courtCase.errorId AND user_id != 'system'")
    .orderBy("create_ts", "DESC")
    .limit(1)

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

  const getExcludedTriggers = (excludedTriggers?: string[]): string[] =>
    excludedTriggers && excludedTriggers.length > 0 ? excludedTriggers : [""]

  query = courtCasesByOrganisationUnitQuery(query, user) as SelectQueryBuilder<CourtCase>

  caseState = caseState ?? "Unresolved"

  query
    .innerJoin(
      (triggerQuery) => {
        return triggerQuery
          .from("Trigger", "triggers")
          .select("triggers.error_id, string_agg(triggers.trigger_code, ',')", "trigger_codes")
          .andWhere(
            "triggers.trigger_code NOT IN (:...excludedTriggers)" +
              (caseState === undefined || caseState === "Unresolved and resolved"
                ? ""
                : " AND triggers.status = :triggerStatus"),
            {
              excludedTriggers: getExcludedTriggers(user.excludedTriggers),
              triggerStatus: caseState === "Resolved" ? "2" : "1"
            }
          )
          .groupBy("triggers.error_id")
      },
      "triggers",
      "courtCase.errorId = triggers.error_id"
    )
    .addSelect("trigger_codes")
    .addSelect("errorLockedByUser.username", "errorLockedByUsername")
    .addSelect("triggerLockedByUser.username", "triggerLockedByUsername")
    .addSelect(`(${mostRecentNoteTextSubquery.getQuery()})`, "most_recent_note_text")
    .addSelect(`(${mostRecentNoteDateSubquery.getQuery()})`, "most_recent_note_date")
    .addSelect(`(${noteCountSubquery.getQuery()})`, "note_count")
    .leftJoin("courtCase.errorLockedByUser", "errorLockedByUser")
    .addSelect(["errorLockedByUser.forenames", "errorLockedByUser.surname"])
    .leftJoin("courtCase.triggerLockedByUser", "triggerLockedByUser")
    .addSelect(["triggerLockedByUser.forenames", "triggerLockedByUser.surname"])

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
    query.orderBy("note_count", sortOrder === "ASC" ? "ASC" : "DESC")
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
        qb.where("trigger_codes ilike '%' || :reason || '%'", {
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
            qb.orWhere(`trigger_codes ilike '%' || :${paramName} || '%'`, {
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
        })
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
          }).orWhere({
            triggerResolvedBy: resolvedByUsername
          })
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

  if (!user.hasAccessTo[Feature.Triggers] && !user.hasAccessTo[Feature.Exceptions]) {
    query.andWhere("false")
  }

  if (!user.hasAccessTo[Feature.Triggers]) {
    query.andWhere({ errorCount: MoreThan(0) })
  }

  if (!user.hasAccessTo[Feature.Exceptions]) {
    query.andWhere({ triggerCount: MoreThan(0) })
  }

  // console.log("SQL", query.getQueryAndParameters())
  try {
    const count = await query.getCount()
    const result = await query
      .offset(pageNumValidated * maxPageItemsValidated)
      .limit(maxPageItemsValidated)
      .getRawMany()

    // console.log("pageNumValidated", pageNumValidated)
    // console.log("maxPageItemsValidated", maxPageItemsValidated)
    // console.log("=>", pageNumValidated * maxPageItemsValidated)
    // console.log("\n")

    if (!isError(count) && !isError(result)) {
      // console.log("CourtCases", count)
      // console.log("CourtCase", result[0])
    }

    return isError(result)
      ? result
      : {
          result,
          totalCases: count
        }
  } catch (error) {
    throw error
  }
}

export default listCourtCases
