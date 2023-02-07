import { DataSource, EntityManager, UpdateQueryBuilder, UpdateResult } from "typeorm/"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

const unlockCourtCase = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  unlockReason?: "Trigger" | "Exception"
): Promise<UpdateResult | Error> => {
  const { canLockExceptions, canLockTriggers, isSupervisor, username, visibleForces } = user
  const shouldUnlockExceptions = canLockExceptions && (unlockReason === undefined || unlockReason === "Exception")
  const shouldUnlockTriggers = canLockTriggers && (unlockReason === undefined || unlockReason === "Trigger")

  if (!shouldUnlockExceptions && !shouldUnlockTriggers) {
    return new Error("User hasn't got permission to unlock the case")
  }

  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const setFields: QueryDeepPartialEntity<CourtCase> = {}
  let query = courtCaseRepository.createQueryBuilder().update(CourtCase)

  if (shouldUnlockExceptions) {
    setFields.errorLockedByUsername = null
  }
  if (shouldUnlockTriggers) {
    setFields.triggerLockedByUsername = null
  }

  query.set(setFields)
  query = courtCasesByVisibleForcesQuery(query, visibleForces) as UpdateQueryBuilder<CourtCase>
  query.andWhere("error_id = :id", { id: courtCaseId })

  if (!isSupervisor && shouldUnlockExceptions) {
    query.andWhere({ errorLockedByUsername: username })
  }

  if (!isSupervisor && shouldUnlockTriggers) {
    query.andWhere({ triggerLockedByUsername: username })
  }

  return query.execute()?.catch((error: Error) => error)
}

export default unlockCourtCase
