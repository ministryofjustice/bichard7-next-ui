import { DataSource, EntityManager, UpdateQueryBuilder, UpdateResult } from "typeorm/"
import { isError } from "types/Result"
import { DEFAULT_STATION_CODE } from "utils/amendments/amendForceOwner/defaultStationCode"
import amendCourtCase from "./amendCourtCase"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import insertNotes from "./insertNotes"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"
import unlockCourtCase from "./unlockCourtCase"

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
      const newForceCode = `${forceCode}${DEFAULT_STATION_CODE}`
      query.set({ orgForPoliceFilter: newForceCode })
      query = courtCasesByVisibleForcesQuery(query, visibleForces) as UpdateQueryBuilder<CourtCase>
      query.andWhere("error_id = :id", { id: courtCaseId })

      const amendResult = await amendCourtCase(entityManager, { forceOwner: forceCode }, courtCaseId, user)

      if (isError(amendResult)) {
        throw amendResult
      }

      const addNoteResult = await insertNotes(entityManager, [
        {
          noteText: `${user.username}: Case reallocated to new force owner: ${newForceCode}00`,
          errorId: courtCaseId,
          userId: "System"
        }
      ])

      if (isError(addNoteResult)) {
        throw addNoteResult
      }

      // TODO: Add audit log messages: Old bichard pushes messages to GENERAL_EVENT_QUEUE which goes into audit log
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
