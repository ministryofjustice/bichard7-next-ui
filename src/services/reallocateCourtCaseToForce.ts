import { DataSource, EntityManager, UpdateQueryBuilder, UpdateResult } from "typeorm/"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

// eslint-disable-next-line @typescript-eslint/naming-convention
const DEFAULT_STATION_CODE = "YZ"

const reallocateCourtCaseToForce = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  forceCode: string
): Promise<UpdateResult | Error> => {
  const { visibleForces } = user

  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const setFields: QueryDeepPartialEntity<CourtCase> = {}
  let query = courtCaseRepository.createQueryBuilder().update(CourtCase)

  setFields.orgForPoliceFilter = `${forceCode}${DEFAULT_STATION_CODE}`

  query.set(setFields)
  query = courtCasesByVisibleForcesQuery(query, visibleForces) as UpdateQueryBuilder<CourtCase>
  query.andWhere("error_id = :id", { id: courtCaseId })

  return query.execute()?.catch((error: Error) => error)
}

export default reallocateCourtCaseToForce
