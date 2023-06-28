import type { DataSource, UpdateResult } from "typeorm"
import type User from "./entities/User"
import updateLockStatusToLocked from "./updateLockStatusToLocked"
import type AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import { isError } from "types/Result"
import storeAuditLogEvents from "./storeAuditLogEvents"
import type CourtCase from "./entities/CourtCase"
import getCourtCase from "./getCourtCase"

const lockCourtCase = async (dataSource: DataSource, courtCaseId: number, user: User): Promise<UpdateResult | Error> =>
  dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const courtCase = (await getCourtCase(entityManager, courtCaseId)) as CourtCase

    if (!courtCase) {
      throw new Error("Failed to unlock: Case not found")
    }

    const events: AuditLogEvent[] = []
    const lockResult = await updateLockStatusToLocked(entityManager, courtCaseId, user, events)

    if (isError(lockResult)) {
      throw lockResult
    }

    const storeAuditLogResponse = await storeAuditLogEvents(courtCase.messageId, events)

    if (isError(storeAuditLogResponse)) {
      throw storeAuditLogResponse
    }

    return lockResult
  })

export default lockCourtCase
