import { DataSource, EntityManager, UpdateQueryBuilder, UpdateResult } from "typeorm/"
import { isError } from "types/Result"
import { DEFAULT_STATION_CODE } from "utils/amendments/amendForceOwner/defaultStationCode"
import amendCourtCase from "./amendCourtCase"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import insertNotes from "./insertNotes"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import UnlockReason from "types/UnlockReason"

const reallocateCourtCaseToForce = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  forceCode: string,
  note?: string
): Promise<UpdateResult | Error> => {
  // TODO:
  // - Add audit log messages: Old bichard pushes messages to GENERAL_EVENT_QUEUE which goes into audit log
  // - Generate TRPR0028 if necessary
  const updateResult = await dataSource.transaction(
    "SERIALIZABLE",
    async (entityManager): Promise<UpdateResult | Error> => {
      const courtCaseRepository = entityManager.getRepository(CourtCase)
      let query = courtCaseRepository.createQueryBuilder().update(CourtCase)
      const newForceCode = `${forceCode}${DEFAULT_STATION_CODE}`
      query.set({ orgForPoliceFilter: newForceCode })
      query = courtCasesByOrganisationUnitQuery(query, user) as UpdateQueryBuilder<CourtCase>
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

      if (note) {
        const addUserNoteResult = await insertNotes(entityManager, [
          {
            noteText: note,
            errorId: courtCaseId,
            userId: user.username
          }
        ])

        if (isError(addUserNoteResult)) {
          throw addUserNoteResult
        }
      }

      const unlockResult = await updateLockStatusToUnlocked(
        entityManager,
        +courtCaseId,
        user,
        UnlockReason.TriggerAndException,
        [] //TODO pass an actual audit log events array
      )

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
