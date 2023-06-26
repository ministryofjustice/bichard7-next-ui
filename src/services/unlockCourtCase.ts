import { DataSource, EntityManager, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import User from "./entities/User"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import storeAuditLogEvents from "./storeAuditLogEvents"
import CourtCase from "./entities/CourtCase"
import getCourtCase from "./getCourtCase"

const unlockCourtCase = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  unlockReason?: "Trigger" | "Exception"
): Promise<UpdateResult | Error> => {
  const updateResult = await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const events: AuditLogEvent[] = []

    const courtCase = (await getCourtCase(entityManager, courtCaseId)) as CourtCase

    if (!courtCase) {
      throw new Error("Failed to unlock: Case not found")
    }

    const unlockResult = await updateLockStatusToUnlocked(entityManager, courtCaseId, user, unlockReason, events)

    if (isError(unlockResult)) {
      throw unlockResult
    }

    const storeAuditLogResponse = await storeAuditLogEvents(courtCase.messageId, events)

    if (isError(storeAuditLogResponse)) {
      throw storeAuditLogResponse
    }

    return unlockResult
  })

  return updateResult
}

export default unlockCourtCase
