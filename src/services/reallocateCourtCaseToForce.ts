import { DataSource, EntityManager, UpdateQueryBuilder, UpdateResult } from "typeorm/"
import { isError } from "types/Result"
import amendCourtCase from "./amendCourtCase"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"
import unlockCourtCase from "./unlockCourtCase"

// eslint-disable-next-line @typescript-eslint/naming-convention
const DEFAULT_STATION_CODE = "YZ"

const reallocateCourtCaseToForce = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  forceCode: string
): Promise<UpdateResult | Error> => {
  const updateResult = await dataSource.transaction(
    "SERIALIZABLE",
    async (entityManager): Promise<UpdateResult | Error> => {
      const { visibleForces } = user

      const courtCaseRepository = entityManager.getRepository(CourtCase)

      let query = courtCaseRepository.createQueryBuilder().update(CourtCase)
      query.set({ orgForPoliceFilter: `${forceCode}${DEFAULT_STATION_CODE}` })
      query = courtCasesByVisibleForcesQuery(query, visibleForces) as UpdateQueryBuilder<CourtCase>
      query.andWhere("error_id = :id", { id: courtCaseId })

      const amendResult = await amendCourtCase(entityManager, { forceOwner: forceCode }, courtCaseId, user)

      if (isError(amendResult)) {
        throw amendResult
      }

      const unlockResult = await unlockCourtCase(entityManager, +courtCaseId, user)

      if (isError(unlockResult)) {
        throw unlockResult
      }

      return query.execute()?.catch((error: Error) => error)
    }
  )

  if (isError(updateResult)) {
    throw updateResult
  }

  return updateResult
}

export default reallocateCourtCaseToForce
