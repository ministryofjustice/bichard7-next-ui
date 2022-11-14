import { format } from "date-fns"
import { DataSource } from "typeorm"
import { CaseListQueryParams } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
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
    resultFilter,
    urgentFilter,
    courtDateRange
  }: CaseListQueryParams
): PromiseResult<ListCourtCaseResult> => {
  const pageNumValidated = (pageNum ? parseInt(pageNum, 10) : 1) - 1 // -1 because the db index starts at 0
  const maxPageItemsValidated = maxPageItems ? parseInt(maxPageItems, 10) : 25
  const courtCaseRepository = connection.getRepository(CourtCase)
  const orderByQuery = `courtCase.${orderBy ?? "errorId"}`
  const query = courtCasesByVisibleForcesQuery(courtCaseRepository, forces)
    .leftJoinAndSelect("courtCase.triggers", "trigger")
    .leftJoinAndSelect("courtCase.notes", "note")
    .orderBy(orderByQuery, order === "desc" ? "DESC" : "ASC")
    .skip(pageNumValidated * maxPageItemsValidated)
    .take(maxPageItemsValidated)

  if (defendantName) {
    query.andWhere("courtCase.defendantName ilike '%' || :name || '%'", {
      name: defendantName
    })
  }

  if (resultFilter?.includes("Triggers")) {
    query.andWhere("courtCase.triggerCount > 0")
  } else if (resultFilter?.includes("Exceptions")) {
    query.andWhere("courtCase.errorCount > 0")
  }

  if (urgentFilter) {
    query.andWhere("courtCase.isUrgent > 0")
  }

  if (courtDateRange) {
    query.andWhere("courtCase.courtDate >= :from", { from: format(courtDateRange.from, "yyyy-MM-dd") })
    query.andWhere("courtCase.courtDate <= :to", { to: format(courtDateRange.to, "yyyy-MM-dd") })
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
