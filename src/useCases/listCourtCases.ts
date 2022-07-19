import { DataSource } from "typeorm"
import { CaseListQueryParams } from "types/CaseListQueryParams"
import CourtCase from "../entities/CourtCase"
import getColumnName from "../lib/getColumnName"
import PromiseResult from "../types/PromiseResult"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

const listCourtCases = async (connection: DataSource, queryParams: CaseListQueryParams): PromiseResult<CourtCase[]> => {
  const courtCaseRepository = connection.getRepository(CourtCase)
  const query = courtCasesByVisibleForcesQuery(courtCaseRepository, queryParams.forces)
    .leftJoinAndSelect("courtCase.triggers", "trigger")
    .orderBy(
      `courtCase.${getColumnName(courtCaseRepository, queryParams.orderBy ?? "errorId")}`,
      queryParams.order ?? "ASC"
    )
    .limit(queryParams.limit)

  if (queryParams.defendantName) {
    query.where("courtCase.defendantName ilike '%' || :name || '%'", {
      name: queryParams.defendantName
    })
  }

  const result = await query.getMany().catch((error: Error) => error)
  return result
}

export default listCourtCases
