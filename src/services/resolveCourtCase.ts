import { DataSource, Not, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import User from "./entities/User"
import { ManualResolution } from "types/ManualResolution"
import CourtCase from "./entities/CourtCase"
import unlockCourtCase from "./unlockCourtCase"
import insertNotes from "./insertNotes"
import Trigger from "./entities/Trigger"

const resolveCourtCase = async (
  dataSource: DataSource,
  courtCaseId: number,
  resolution: ManualResolution,
  user: User
): Promise<UpdateResult | Error> => {
  const updateResult = dataSource.transaction("SERIALIZABLE", async (entityManager): Promise<UpdateResult | Error> => {
    const courtCaseRepository = entityManager.getRepository(CourtCase)
    const triggersResolved =
      (
        await entityManager.getRepository(Trigger).find({
          where: {
            errorId: courtCaseId,
            status: Not("Resolved")
          }
        })
      ).length === 0

    const resolver = user.username
    const resolutionTimestamp = new Date()
    const query = courtCaseRepository.createQueryBuilder().update(CourtCase)

    const queryParams: Record<string, unknown> = {
      errorStatus: "Resolved",
      errorResolvedBy: resolver,
      errorResolvedTimestamp: resolutionTimestamp
    }

    if (triggersResolved) {
      queryParams.resolutionTimestamp = resolutionTimestamp
    }

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

    query.set(queryParams)
    query.where("error_id = :id", { id: courtCaseId })

    return query.execute()?.catch((error: Error) => error)
  })
  if (isError(updateResult)) {
    throw updateResult
  }

  return updateResult
}

export default resolveCourtCase
