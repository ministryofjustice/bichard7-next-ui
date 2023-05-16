import { DataSource, Not, UpdateQueryBuilder, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import User from "./entities/User"
import { ManualResolution } from "types/ManualResolution"
import CourtCase from "./entities/CourtCase"
import unlockCourtCase from "./unlockCourtCase"
import insertNotes from "./insertNotes"
import Trigger from "./entities/Trigger"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"

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
    let query = courtCaseRepository.createQueryBuilder().update(CourtCase)
    query = courtCasesByOrganisationUnitQuery(query, user) as UpdateQueryBuilder<CourtCase>

    const queryParams: Record<string, unknown> = {
      errorStatus: "Resolved",
      errorResolvedBy: resolver,
      errorResolvedTimestamp: resolutionTimestamp
    }

    if (triggersResolved) {
      queryParams.resolutionTimestamp = resolutionTimestamp
    }

    query.set(queryParams)
    query.andWhere({ errorId: courtCaseId, errorLockedByUsername: resolver })

    const queryResult = await query.execute()

    if (queryResult.affected === 0) {
      return new Error("Failed to resolve case")
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

    return queryResult
  })
  if (isError(updateResult)) {
    throw updateResult
  }

  return updateResult
}

export default resolveCourtCase
