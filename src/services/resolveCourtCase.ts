import { DataSource, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import User from "./entities/User"
import { ManualResolution } from "types/ManualResolution"
import CourtCase from "./entities/CourtCase"
import unlockCourtCase from "./unlockCourtCase"
import insertNotes from "./insertNotes"

const resolveCourtCase = async (
  dataSource: DataSource,
  courtCaseId: number,
  resolution: ManualResolution,
  user: User
): Promise<UpdateResult | Error> => {
  const updateResult = dataSource.transaction("SERIALIZABLE", async (entityManager): Promise<UpdateResult | Error> => {
    const courtCaseRepository = entityManager.getRepository(CourtCase)
    const resolver = user.username
    const resolutionTimestamp = new Date()

    const query = courtCaseRepository.createQueryBuilder().update(CourtCase)
    query.set({
      errorStatus: "Resolved",
      errorResolvedBy: resolver,
      errorResolvedTimestamp: resolutionTimestamp,
      resolutionTimestamp: resolutionTimestamp
    })
    query.andWhere("error_id = :id", { id: courtCaseId })

    const unlockResult = await unlockCourtCase(entityManager, +courtCaseId, user)

    if (isError(unlockResult)) {
      throw unlockResult
    }

    const addNoteResult = await insertNotes(entityManager, [
      {
        noteText:
          `${resolver}: Portal Action: Record Manually Resolved.` +
          ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`,
        errorId: courtCaseId,
        userId: "System"
      }
    ])

    if (isError(addNoteResult)) {
      throw addNoteResult
    }

    return query.execute()?.catch((error: Error) => error)
  })
  if (isError(updateResult)) {
    throw updateResult
  }

  return updateResult
}

export default resolveCourtCase
