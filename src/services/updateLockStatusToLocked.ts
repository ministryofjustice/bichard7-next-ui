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
import Feature from "types/Feature"

const lock = async (
  lockReason: "Trigger" | "Exception",
  courtCaseRepository: Repository<CourtCase>,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  const result = await courtCaseRepository
    .createQueryBuilder()
    .update(CourtCase)
    .set({ [lockReason === "Exception" ? "errorLockedByUsername" : "triggerLockedByUsername"]: user.username })
    .andWhere({
      errorId: courtCaseId,
      [lockReason === "Exception" ? "errorLockedByUsername" : "triggerLockedByUsername"]: IsNull(),
      [lockReason === "Exception" ? "errorCount" : "triggerCount"]: MoreThan(0),
      [lockReason === "Exception" ? "errorStatus" : "triggerStatus"]: Not("Submitted")
    })
    .execute()
    .catch((error) => error as Error)

  if (!result) {
    return new Error(`Failed to lock ${lockReason}`)
  }

  if (isError(result)) {
    return result
  }

  if (result.affected && result.affected > 0) {
    events.push(
      getAuditLogEvent(
        lockReason === "Exception" ? AuditLogEventOptions.exceptionLocked : AuditLogEventOptions.triggerLocked,
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

  if (user.hasAccessTo[Feature.Exceptions]) {
    result = await lock("Exception", courtCaseRepository, courtCaseId, user, events)
  }

  if (user.hasAccessTo[Feature.Triggers]) {
    result = await lock("Trigger", courtCaseRepository, courtCaseId, user, events)
  }

  return result ?? new Error("update requires a lock (exception or trigger) to update")
}

export default updateLockStatusToLocked
