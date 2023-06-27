import type { DataSource, UpdateResult } from "typeorm"
import type User from "./entities/User"
import updateLockStatusToLocked from "./updateLockStatusToLocked"
import type AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"

const lockCourtCase = async (
  dataSource: DataSource,
  courtCaseId: number,
  user: User
): Promise<UpdateResult | Error> => {
  const events: AuditLogEvent[] = []
  return updateLockStatusToLocked(dataSource.manager, courtCaseId, user, events)
}

export default lockCourtCase
