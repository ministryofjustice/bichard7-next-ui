import { DataSource, EntityManager, MoreThan, Not, UpdateQueryBuilder } from "typeorm"
import { isError } from "types/Result"
import User from "./entities/User"
import { ManualResolution } from "types/ManualResolution"
import CourtCase from "./entities/CourtCase"
import unlockCourtCase from "./unlockCourtCase"
import insertNotes from "./insertNotes"
import Trigger from "./entities/Trigger"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import { validateManualResolution } from "utils/validators/validateManualResolution"
import { auditLoggingTransaction } from "./auditLoggingTransaction"

const resolveCourtCase = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  resolution: ManualResolution,
  user: User
): Promise<void> => {
  const courtCase = await dataSource.getRepository(CourtCase).findOneByOrFail({ errorId: courtCaseId })

  if (!courtCase) {
    throw new Error("Failed to resolve, case not found!")
  }

  await auditLoggingTransaction(dataSource, courtCase.messageId, async (_, entityManager) => {
    const resolutionError = validateManualResolution(resolution).error

    if (resolutionError) {
      throw new Error(resolutionError)
    }

    const courtCaseRepository = entityManager.getRepository(CourtCase)
    const resolver = user.username
    const resolutionTimestamp = new Date()
    let query = courtCaseRepository.createQueryBuilder().update(CourtCase)
    query = courtCasesByOrganisationUnitQuery(query, user) as UpdateQueryBuilder<CourtCase>

    const queryParams: Record<string, unknown> = {
      errorStatus: "Resolved",
      errorResolvedBy: resolver,
      errorResolvedTimestamp: resolutionTimestamp
    }

    const triggersResolved =
      (
        await entityManager.getRepository(Trigger).find({
          where: {
            errorId: courtCaseId,
            status: Not("Resolved")
          }
        })
      ).length === 0

    if (triggersResolved) {
      queryParams.resolutionTimestamp = resolutionTimestamp
    }

    query.set(queryParams)
    query.andWhere({
      errorId: courtCaseId,
      errorLockedByUsername: resolver,
      errorCount: MoreThan(0),
      errorStatus: "Unresolved"
    })

    const queryResult = await query.execute()

    if (queryResult.affected === 0) {
      throw new Error("Failed to resolve case")
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
  })
}

export default resolveCourtCase
