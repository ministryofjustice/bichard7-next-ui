import { DataSource, EntityManager, MoreThan, Not, UpdateQueryBuilder } from "typeorm"
import { isError } from "types/Result"
import User from "./entities/User"
import { ManualResolution, ResolutionReasonCode } from "types/ManualResolution"
import CourtCase from "./entities/CourtCase"
import unlockCourtCase from "./unlockCourtCase"
import insertNotes from "./insertNotes"
import Trigger from "./entities/Trigger"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import { validateManualResolution } from "utils/validators/validateManualResolution"
import storeAuditLogEvents from "./storeAuditLogEvents"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"

const resolveCourtCase = async (
  dataSource: DataSource | EntityManager,
  courtCase: CourtCase,
  resolution: ManualResolution,
  user: User
): Promise<void> => {
  await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const events: AuditLogEvent[] = []
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
            errorId: courtCase.errorId,
            status: Not("Resolved")
          }
        })
      ).length === 0

    if (triggersResolved) {
      queryParams.resolutionTimestamp = resolutionTimestamp
    }

    query.set(queryParams)
    query.andWhere({
      errorId: courtCase.errorId,
      errorLockedByUsername: resolver,
      errorCount: MoreThan(0),
      errorStatus: "Unresolved"
    })

    const queryResult = await query.execute()

    if (queryResult.affected === 0) {
      throw new Error("Failed to resolve case")
    }

    events?.push(
      getAuditLogEvent("information", "Exception marked as resolved by user", "Bichard New UI", {
        user: user.username,
        auditLogVersion: 2,
        eventCode: "exceptions.resolved",
        resolutionReasonCode: ResolutionReasonCode[resolution.reason],
        resolutionReasonText: resolution.reasonText
      })
    )

    const unlockResult = await unlockCourtCase(entityManager, courtCase.errorId, user, undefined, events)
    if (isError(unlockResult)) {
      throw unlockResult
    }

    const addNoteResult = await insertNotes(entityManager, [
      {
        noteText:
          `${resolver}: Portal Action: Record Manually Resolved.` +
          ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`,
        errorId: courtCase.errorId,
        userId: "System"
      }
    ])

    if (isError(addNoteResult)) {
      throw addNoteResult
    }

    await storeAuditLogEvents(courtCase.messageId, events)
  })
}

export default resolveCourtCase
