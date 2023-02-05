import { DataSource, EntityManager, UpdateResult } from "typeorm/"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"

const unlockCourtCase = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User
  // fieldToUnlock?: "Trigger" | "Error"
): Promise<UpdateResult | Error> => {
  const { canLockExceptions, canLockTriggers, username } = user

  if (!canLockExceptions && !canLockTriggers) {
    return new Error("User hasn't got permission to unlock a case")
  }

  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const setFields: QueryDeepPartialEntity<CourtCase> = {}

  const query = courtCaseRepository
    .createQueryBuilder()
    .update(CourtCase)
    .where({ errorLockedByUsername: username, triggerLockedByUsername: username })

  if (canLockExceptions) {
    setFields.errorLockedByUsername = null
  }
  if (canLockTriggers) {
    setFields.triggerLockedByUsername = null
  }

  query.set(setFields).where("error_id = :id", { id: courtCaseId })

  return query.execute().catch((error: Error) => error)
}

export default unlockCourtCase
