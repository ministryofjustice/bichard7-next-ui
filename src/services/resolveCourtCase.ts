import { DataSource, EntityManager, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import User from "./entities/User"
import { ManualResolution } from "types/ManualResolution"
import CourtCase from "./entities/CourtCase"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import insertNotes from "./insertNotes"
import storeAuditLogEvents from "./storeAuditLogEvents"
import { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import resolveError from "./resolveError"
import UnlockReason from "types/UnlockReason"

const resolveCourtCase = async (
  dataSource: DataSource | EntityManager,
  courtCase: CourtCase,
  resolution: ManualResolution,
  user: User
): Promise<UpdateResult | Error> => {
  return dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const events: AuditLogEvent[] = []

    const resolveErrorResult = await resolveError(entityManager, courtCase, user, resolution, events)

    if (isError(resolveErrorResult)) {
      throw resolveErrorResult
    }

    const unlockResult = await updateLockStatusToUnlocked(
      entityManager,
      courtCase,
      user,
      UnlockReason.TriggerAndException,
      events
    )
    if (isError(unlockResult)) {
      throw unlockResult
    }

    const addNoteResult = await insertNotes(entityManager, [
      {
        noteText:
          `${user.username}: Portal Action: Record Manually Resolved.` +
          ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`,
        errorId: courtCase.errorId,
        userId: "System"
      }
    ])

    if (isError(addNoteResult)) {
      throw addNoteResult
    }

    const storeAuditLogResponse = await storeAuditLogEvents(courtCase.messageId, events)

    if (isError(storeAuditLogResponse)) {
      throw storeAuditLogResponse
    }

    return resolveErrorResult
  })
}

export default resolveCourtCase
