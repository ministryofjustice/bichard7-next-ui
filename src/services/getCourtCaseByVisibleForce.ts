import { DataSource, EntityManager, SelectQueryBuilder } from "typeorm"
import CourtCase from "./entities/CourtCase"
import PromiseResult from "../types/PromiseResult"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import User from "./entities/User"

const getCourtCaseByVisibleForce = (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User
): PromiseResult<CourtCase | null> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  let query = courtCaseRepository.createQueryBuilder("courtCase")
  query = courtCasesByOrganisationUnitQuery(query, user) as SelectQueryBuilder<CourtCase>
  query
    .andWhere({ errorId: courtCaseId })
    .leftJoinAndSelect("courtCase.triggers", "trigger")
    .leftJoinAndSelect("courtCase.notes", "note")
    .addOrderBy("note.createdAt", "ASC")

  return query.getOne().catch((error) => error)
}

export default getCourtCaseByVisibleForce
