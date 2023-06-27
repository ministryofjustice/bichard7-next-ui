import { EntityManager, IsNull, MoreThan, Not, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import { ResolutionStatus } from "types/ResolutionStatus"
import type AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"

const updateLockStatusToLocked = (
  dataSource: EntityManager,
  courtCaseId: number,
  { canLockExceptions, canLockTriggers, username }: User,
  _: AuditLogEvent[]
): Promise<UpdateResult | Error> | Error => {
  if (!canLockExceptions && !canLockTriggers) {
    return new Error("update requires a lock (exception or trigger) to update")
  }

  const courtCaseRepository = dataSource.getRepository(CourtCase)

  const query = courtCaseRepository
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      ...(canLockExceptions ? { errorLockedByUsername: username } : {}),
      ...(canLockTriggers ? { triggerLockedByUsername: username } : {})
    })
    .where({ errorId: courtCaseId })

  const submitted: ResolutionStatus = "Submitted"

  if (canLockExceptions) {
    query.andWhere({
      errorLockedByUsername: IsNull(),
      errorCount: MoreThan(0),
      errorStatus: Not(submitted)
    })
  }

  if (canLockTriggers) {
    // we are checking the trigger status, this is not what legacy bichard does but we think that's a bug. Legacy bichard checks error_status (bichard-backend/src/main/java/uk/gov/ocjr/mtu/br7/errorlistmanager/data/ErrorDAO.java ln 1455)
    query.andWhere({
      triggerLockedByUsername: IsNull(),
      triggerCount: MoreThan(0),
      triggerStatus: Not(submitted)
    })
  }

  return query.execute().catch((error) => error)
}

export default updateLockStatusToLocked
