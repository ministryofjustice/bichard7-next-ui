import { DataSource } from "typeorm"
import { CaseListQueryParams } from "types/CaseListQueryParams"
import CourtCase from "services/entities/CourtCase"
import { isError } from "types/Result"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import PromiseResult from "types/PromiseResult"
import getColumnName from "services/getColumnName"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

const listCourtCases = async (
  connection: DataSource,
  { pageNum, maxPageItems, forces, orderBy, order, defendantName, resultFilter }: CaseListQueryParams
): PromiseResult<ListCourtCaseResult> => {
  const pageNumValidated = (pageNum ? parseInt(pageNum, 10) : 1) - 1 // -1 because the db index starts at 0
  const maxPageItemsValidated = maxPageItems ? parseInt(maxPageItems, 10) : 25
  const courtCaseRepository = connection.getRepository(CourtCase)
  const query = courtCasesByVisibleForcesQuery(courtCaseRepository, forces)
    .leftJoinAndSelect("courtCase.triggers", "trigger")
    .orderBy(`courtCase.${getColumnName(courtCaseRepository, orderBy ?? "errorId")}`, order === "desc" ? "DESC" : "ASC")
    .offset(pageNumValidated * maxPageItemsValidated)
    .limit(maxPageItemsValidated)

  if (defendantName) {
    query.andWhere("courtCase.defendantName ilike '%' || :name || '%'", {
      name: defendantName
    })
  }

  if (resultFilter === "triggers") {
    query.andWhere("courtCase.triggerCount > 0")
  } else if (resultFilter === "exceptions") {
    query.andWhere("courtCase.errorCount > 0")
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
