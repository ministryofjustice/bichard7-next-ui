import { DataSource, EntityManager, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import User from "./entities/User"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"

const unlockCourtCase = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  unlockReason?: "Trigger" | "Exception"
): Promise<UpdateResult | Error> => {
  const updateResult = await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const events: AuditLogEvent[] = []

    const unlockResult = await updateLockStatusToUnlocked(entityManager, courtCaseId, user, unlockReason, events)
    if (isError(unlockResult)) {
      throw unlockResult
    }

    return unlockResult
  })

  return updateResult
}

export default unlockCourtCase
