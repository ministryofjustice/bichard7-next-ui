import CourtCase from "../entities/CourtCase"
import { DataSource } from "typeorm"
import PromiseResult from "../types/PromiseResult"
import getColumnName from "../lib/getColumnName"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

const listCourtCases = async (connection: DataSource, forces: string[], limit: number): PromiseResult<CourtCase[]> => {
  const courtCaseRepository = connection.getRepository(CourtCase)
  const query = courtCasesByVisibleForcesQuery(courtCaseRepository, forces)
    .orderBy(getColumnName(courtCaseRepository, "errorId"), "ASC")
    .limit(limit)

  const result = await query.getMany().catch((error: Error) => error)
  return result
}

export default listCourtCases
