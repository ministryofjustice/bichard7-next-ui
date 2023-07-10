import { EntityManager, IsNull, MoreThan, Not, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import { ResolutionStatus } from "types/ResolutionStatus"
import {
  AuditLogEventOptions,
  type AuditLogEvent
} from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/dist/lib/auditLog/getAuditLogEvent"
import { isError } from "types/Result"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/dist/types/EventCategory"

const updateLockStatusToLocked = async (
  dataSource: EntityManager,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  if (!user.hasAccessToExceptions && !user.hasAccessToTriggers) {
    return new Error("update requires a lock (exception or trigger) to update")
  }

  const generatedEvents: AuditLogEvent[] = []
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  const query = courtCaseRepository
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      ...(user.hasAccessToExceptions ? { errorLockedByUsername: user.username } : {}),
      ...(user.hasAccessToTriggers ? { triggerLockedByUsername: user.username } : {})
    })
    .where({ errorId: courtCaseId })

  const submitted: ResolutionStatus = "Submitted"

  if (user.hasAccessToExceptions) {
    query.andWhere({
      errorLockedByUsername: IsNull(),
      errorCount: MoreThan(0),
      errorStatus: Not(submitted)
    })
    generatedEvents.push(
      getAuditLogEvent(AuditLogEventOptions.exceptionLocked, EventCategory.information, "Bichard New UI", {
        user: user.username,
        auditLogVersion: 2,
        eventCode: "exceptions.locked"
      })
    )
  }

  if (user.hasAccessToTriggers) {
    // we are checking the trigger status, this is not what legacy bichard does but we think that's a bug. Legacy bichard checks error_status (bichard-backend/src/main/java/uk/gov/ocjr/mtu/br7/errorlistmanager/data/ErrorDAO.java ln 1455)
    query.andWhere({
      triggerLockedByUsername: IsNull(),
      triggerCount: MoreThan(0),
      triggerStatus: Not(submitted)
    })
    generatedEvents.push(
      getAuditLogEvent(AuditLogEventOptions.triggerLocked, EventCategory.information, "Bichard New UI", {
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
