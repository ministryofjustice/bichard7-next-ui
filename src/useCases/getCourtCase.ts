import { DataSource } from "typeorm"
import CourtCase from "../entities/CourtCase"
import PromiseResult from "../types/PromiseResult"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

const getCourtCase = (
  dataSource: DataSource,
  courtCaseId: number,
  forces: string[]
): PromiseResult<CourtCase | null> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const query = courtCasesByVisibleForcesQuery(courtCaseRepository, forces)
    .andWhere({ errorId: courtCaseId })
    .leftJoinAndSelect("courtCase.triggers", "trigger")

  return query.getOne().catch((error) => error)
}

export default getCourtCase
