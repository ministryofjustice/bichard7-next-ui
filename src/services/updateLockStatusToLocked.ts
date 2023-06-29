import { EntityManager, IsNull, MoreThan, Not, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import { ResolutionStatus } from "types/ResolutionStatus"
import type AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import { isError } from "types/Result"
import { canLockExceptions, canLockTriggers } from "utils/userPermissions"

const updateLockStatusToLocked = async (
  dataSource: EntityManager,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  if (!canLockExceptions(user) && !canLockTriggers(user)) {
    return new Error("update requires a lock (exception or trigger) to update")
  }

  const generatedEvents: AuditLogEvent[] = []
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  const query = courtCaseRepository
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      ...(canLockExceptions(user) ? { errorLockedByUsername: user.username } : {}),
      ...(canLockTriggers(user) ? { triggerLockedByUsername: user.username } : {})
    })
    .where({ errorId: courtCaseId })

  const submitted: ResolutionStatus = "Submitted"

  if (canLockExceptions(user)) {
    query.andWhere({
      errorLockedByUsername: IsNull(),
      errorCount: MoreThan(0),
      errorStatus: Not(submitted)
    })
    generatedEvents.push(
      getAuditLogEvent("information", "Exception locked", "Bichard New UI", {
        user: user.username,
        auditLogVersion: 2,
        eventCode: "exceptions.locked"
      })
    )
  }

  if (canLockTriggers(user)) {
    // we are checking the trigger status, this is not what legacy bichard does but we think that's a bug. Legacy bichard checks error_status (bichard-backend/src/main/java/uk/gov/ocjr/mtu/br7/errorlistmanager/data/ErrorDAO.java ln 1455)
    query.andWhere({
      triggerLockedByUsername: IsNull(),
      triggerCount: MoreThan(0),
      triggerStatus: Not(submitted)
    })
    generatedEvents.push(
      getAuditLogEvent("information", "Trigger locked", "Bichard New UI", {
        user: user.username,
        auditLogVersion: 2,
        eventCode: "triggers.locked"
      })
    )
  }

  const result = await query.execute().catch((error) => error)

  if (!isError(result) && result.affected && result.affected > 0) {
    generatedEvents.forEach((event) => events.push(event))
  }

  return result
}

export default updateLockStatusToLocked
