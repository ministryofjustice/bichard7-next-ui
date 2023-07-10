import { EntityManager, IsNull, MoreThan, Not, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import { ResolutionStatus } from "types/ResolutionStatus"
import type AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import { isError } from "types/Result"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"

const updateLockStatusToLocked = async (
  dataSource: EntityManager,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const submitted: ResolutionStatus = "Submitted"
  let result: UpdateResult | undefined

  if (user.hasAccessToExceptions) {
    const exceptionQuery = courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set({ errorLockedByUsername: user.username })
      .where({
        errorId: courtCaseId,
        errorLockedByUsername: IsNull(),
        errorCount: MoreThan(0),
        errorStatus: Not(submitted)
      })

    result = await exceptionQuery.execute().catch((error) => error)

    if (!result) {
      return new Error("Failed to lock exception")
    }

    if (isError(result)) {
      return result
    }

    if (result.affected && result.affected > 0) {
      events.push(
        getAuditLogEvent("information", "Exception locked", AUDIT_LOG_EVENT_SOURCE, {
          user: user.username,
          auditLogVersion: 2,
          eventCode: "exceptions.locked"
        })
      )
    }
  }

  if (user.hasAccessToTriggers) {
    const triggerQuery = courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set({ triggerLockedByUsername: user.username })
      .where({
        errorId: courtCaseId,
        triggerLockedByUsername: IsNull(),
        triggerCount: MoreThan(0),
        triggerStatus: Not(submitted)
      }) // we are checking the trigger status, this is not what legacy bichard does but we think that's a bug. Legacy bichard checks error_status (bichard-backend/src/main/java/uk/gov/ocjr/mtu/br7/errorlistmanager/data/ErrorDAO.java ln 1455)

    result = await triggerQuery.execute().catch((error) => error)

    if (!result) {
      return new Error("Failed to lock trigger")
    }

    if (isError(result)) {
      return result
    }

    if (result.affected && result.affected > 0) {
      events.push(
        getAuditLogEvent("information", "Trigger locked", AUDIT_LOG_EVENT_SOURCE, {
          user: user.username,
          auditLogVersion: 2,
          eventCode: "triggers.locked"
        })
      )
    }
  }

  return result ?? new Error("update requires a lock (exception or trigger) to update")
}

export default updateLockStatusToLocked
