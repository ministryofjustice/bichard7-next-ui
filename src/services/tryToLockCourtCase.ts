import { DataSource, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"

// TODO: we should import this from core
enum ResolutionStatus {
  UNRESOLVED = 1,
  RESOLVED = 2,
  SUBMITTED = 3,
  READONLY = 4, // Intermediate state when a trigger is unresolved but the current user doesn't handle the trigger. Doesn't get written to the database (from legacy bichard)
  SELECTED = 5 // Intermediate state when the checkbox for a trigger has been selected but the 'Mark Selected As Complete' has not been pressed. Doesn't get written to the database
}

const tryToLockCourtCase = (
  dataSource: DataSource,
  courtCaseId: number,
  userName: string,
  lockException = true,
  lockTrigger = true
): Promise<UpdateResult | Error> | Error => {
  if (!lockException && !lockTrigger) {
    return new Error("update requires a lock (exception or trigger) to update")
  }

  const courtCaseRepository = dataSource.getRepository(CourtCase)

  const query = courtCaseRepository
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      ...(lockException ? { errorLockedByUsername: userName } : {}),
      ...(lockTrigger ? { triggerLockedByUsername: userName } : {})
    })
    .where("error_id = :id", { id: courtCaseId })

  if (lockException) {
    query
      .andWhere("error_locked_by_id IS NULL")
      .andWhere("error_count > 0")
      .andWhere(`error_status != ${ResolutionStatus.SUBMITTED}`)
  }

  if (lockTrigger) {
    // we are checking the trigger status, this is not what legacy bichard does but we think that's a bug. Legacy bichard checks error_status (bichard-backend/src/main/java/uk/gov/ocjr/mtu/br7/errorlistmanager/data/ErrorDAO.java ln 1455)
    query
      .andWhere("trigger_locked_by_id IS NULL")
      .andWhere("trigger_count > 0")
      .andWhere(`trigger_status != ${ResolutionStatus.SUBMITTED}`)
  }

  return query
    .execute()
    .catch((error) => error)
}

export default tryToLockCourtCase
