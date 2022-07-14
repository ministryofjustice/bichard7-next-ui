import CourtCase from "../entities/CourtCase"
import { DataSource } from "typeorm"
import PromiseResult from "../types/PromiseResult"
import getColumnName from "../lib/getColumnName"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"
import { QueryParams } from "types/QueryParams"

const listCourtCases = async (connection: DataSource, queryParams: QueryParams): PromiseResult<CourtCase[]> => {
  const courtCaseRepository = connection.getRepository(CourtCase)
  const query = courtCasesByVisibleForcesQuery(courtCaseRepository, queryParams.forces)
    .leftJoinAndSelect("courtCase.triggers", "trigger")
    .orderBy(
      `courtCase.${getColumnName(courtCaseRepository, queryParams.orderBy ?? "errorId")}`,
      queryParams.order ?? "ASC"
    )
    .limit(queryParams.limit)

  const result = await query.getMany().catch((error: Error) => error)
  return result
}

export default listCourtCases
