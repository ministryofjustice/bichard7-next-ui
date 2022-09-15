import { DataSource, IsNull, MoreThan, Not, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import { ResolutionStatus } from "types/ResolutionStatus"

const tryToLockCourtCase = (
  dataSource: DataSource,
  courtCaseId: number,
  user: User
): Promise<UpdateResult | Error> | Error => {
  const lockException = user.canLockExceptions
  const lockTrigger = user.canLockTriggers

  if (!lockException && !lockTrigger) {
    return new Error("update requires a lock (exception or trigger) to update")
  }

  const courtCaseRepository = dataSource.getRepository(CourtCase)

  const query = courtCaseRepository
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      ...(lockException ? { errorLockedByUsername: user.username } : {}),
      ...(lockTrigger ? { triggerLockedByUsername: user.username } : {})
    })
    .where({ errorId: courtCaseId })

  const submitted: ResolutionStatus = "Submitted"

  if (lockException) {
    query.andWhere({
      errorLockedByUsername: IsNull(),
      errorCount: MoreThan(0),
      errorStatus: Not(submitted)
    })
  }

  if (lockTrigger) {
    // we are checking the trigger status, this is not what legacy bichard does but we think that's a bug. Legacy bichard checks error_status (bichard-backend/src/main/java/uk/gov/ocjr/mtu/br7/errorlistmanager/data/ErrorDAO.java ln 1455)
    query.andWhere({
      triggerLockedByUsername: IsNull(),
      triggerCount: MoreThan(0),
      triggerStatus: Not(submitted)
    })
  }

  return query.execute().catch((error) => error)
}

export default tryToLockCourtCase
