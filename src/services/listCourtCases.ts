import {
  Brackets,
  DataSource,
  IsNull,
  LessThanOrEqual,
  ILike,
  MoreThan,
  MoreThanOrEqual,
  Not,
  SelectQueryBuilder
} from "typeorm"
import { CaseListQueryParams } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import { BailCodes } from "utils/bailCodes"
import CourtCase from "./entities/CourtCase"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

const listCourtCases = async (
  connection: DataSource,
  {
    pageNum,
    maxPageItems,
    forces,
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
  }: CaseListQueryParams
): PromiseResult<ListCourtCaseResult> => {
  const pageNumValidated = (pageNum ? parseInt(pageNum, 10) : 1) - 1 // -1 because the db index starts at 0
  const maxPageItemsValidated = maxPageItems ? parseInt(maxPageItems, 10) : 25
  const repository = connection.getRepository(CourtCase)
  let query = repository.createQueryBuilder("courtCase")
  query = courtCasesByVisibleForcesQuery(query, forces) as SelectQueryBuilder<CourtCase>
  query
    .leftJoinAndSelect("courtCase.triggers", "trigger")
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
    query.loadRelationCountAndMap("countCase.noteCount", "courtCase.notes")
    const foo = await query.getMany()
    console.log(foo)

    query.orderBy("courtCase.noteCount", sortOrder === "ASC" ? "DESC" : "ASC")
  } else {
    query.orderBy("courtCase.errorId", sortOrder)
  }

  // Secondary sorts
  if (orderBy !== "courtDate") {
    query.addOrderBy("courtCase.courtDate", "DESC")
  }
  if (orderBy !== "ptiurn") {
    query.addOrderBy("courtCase.ptiurn")
  }

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
        if (reasons?.includes("Triggers")) {
          qb.where({ triggerCount: MoreThan(0) })
        }

        if (reasons?.includes("Exceptions")) {
          qb.orWhere({ errorCount: MoreThan(0) })
        }

        if (reasons?.includes("Bails")) {
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

  if (!caseState) {
    query.andWhere({
      resolutionTimestamp: IsNull()
    })
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

  // console.log("Query", query.getQueryAndParameters())

  const result = await query.getManyAndCount().catch((error: Error) => error)

  // console.log("Result", result)

  return isError(result)
    ? result
    : {
        result: result[0],
        totalCases: result[1]
      }
}

export default listCourtCases
