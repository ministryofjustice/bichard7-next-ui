import { DataSource, EntityManager, SelectQueryBuilder } from "typeorm"
import CourtCase from "./entities/CourtCase"
import PromiseResult from "../types/PromiseResult"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

const getCourtCaseByVisibleForce = (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  forces: string[]
): PromiseResult<CourtCase | null> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  let query = courtCaseRepository.createQueryBuilder("courtCase")
  query = courtCasesByVisibleForcesQuery(query, forces) as SelectQueryBuilder<CourtCase>
  query
    .andWhere({ errorId: courtCaseId })
    .leftJoinAndSelect("courtCase.triggers", "trigger")
    .leftJoinAndSelect("courtCase.notes", "note")
    .addOrderBy("note.createdAt", "ASC")

  return query.getOne().catch((error) => error)
}

export default getCourtCaseByVisibleForce
