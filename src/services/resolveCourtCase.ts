import { DataSource, EntityManager } from "typeorm"
import { isError } from "types/Result"
import User from "./entities/User"
import { ManualResolution } from "types/ManualResolution"
import CourtCase from "./entities/CourtCase"
import unlockCourtCase from "./unlockCourtCase"
import insertNotes from "./insertNotes"
import storeAuditLogEvents from "./storeAuditLogEvents"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import resolveError from "./resolveError"

const resolveCourtCase = async (
  dataSource: DataSource | EntityManager,
  courtCase: CourtCase,
  resolution: ManualResolution,
  user: User
): Promise<void> => {
  await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const events: AuditLogEvent[] = []

    const resolveErrorResult = await resolveError(entityManager, courtCase, user, resolution, events)

    if (isError(resolveErrorResult)) {
      throw resolveErrorResult
    }

    const unlockResult = await unlockCourtCase(entityManager, courtCase.errorId, user, undefined, events)
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
  })
}

export default resolveCourtCase
