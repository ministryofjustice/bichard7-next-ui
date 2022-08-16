import { DataSource, EntityManager } from "typeorm"
import CourtCase from "./entities/CourtCase"
import PromiseResult from "../types/PromiseResult"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

const getCourtCase = (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  forces: string[]
): PromiseResult<CourtCase | null> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const query = courtCasesByVisibleForcesQuery(courtCaseRepository, forces)
    .andWhere({ errorId: courtCaseId })
    .leftJoinAndSelect("courtCase.triggers", "trigger")
    .leftJoinAndSelect("courtCase.notes", "note")

  return query.getOne().catch((error) => error)
}

export default getCourtCase
