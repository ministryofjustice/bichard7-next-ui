import { EntityManager, IsNull, MoreThan, Not, Repository, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import {
  AuditLogEventOptions,
  type AuditLogEvent
} from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/dist/lib/auditLog/getAuditLogEvent"
import { isError } from "types/Result"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/dist/types/EventCategory"

const lock = async (
  unlockReason: "Trigger" | "Exception",
  courtCaseRepository: Repository<CourtCase>,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  const result = await courtCaseRepository
    .createQueryBuilder()
    .update(CourtCase)
    .set({ [unlockReason === "Exception" ? "errorLockedByUsername" : "triggerLockedByUsername"]: user.username })
    .andWhere({
      errorId: courtCaseId,
      [unlockReason === "Exception" ? "errorLockedByUsername" : "triggerLockedByUsername"]: IsNull(),
      [unlockReason === "Exception" ? "errorCount" : "triggerCount"]: MoreThan(0),
      [unlockReason === "Exception" ? "errorStatus" : "triggerStatus"]: Not("Submitted")
    })
    .execute()
    .catch((error) => error)

  if (!result) {
    return new Error(`Failed to lock ${unlockReason}`)
  }

  if (isError(result)) {
    return result
  }

  if (result.affected && result.affected > 0) {
    events.push(
      getAuditLogEvent(
        unlockReason === "Exception" ? AuditLogEventOptions.exceptionLocked : AuditLogEventOptions.triggerLocked,
        EventCategory.information,
        AUDIT_LOG_EVENT_SOURCE,
        {
          user: user.username,
          auditLogVersion: 2
        }
      )
    )
  }

  return result
}

const updateLockStatusToLocked = async (
  dataSource: EntityManager,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  let result: UpdateResult | Error | undefined

  if (user.hasAccessToExceptions) {
    result = await lock("Exception", courtCaseRepository, courtCaseId, user, events)
  }

  if (user.hasAccessToTriggers) {
    result = await lock("Trigger", courtCaseRepository, courtCaseId, user, events)
  }

  return result ?? new Error("update requires a lock (exception or trigger) to update")
}

export default updateLockStatusToLocked
