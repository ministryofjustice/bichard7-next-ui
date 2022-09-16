import { DataSource, UpdateResult } from "typeorm/"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"

const unlockCourtCase = (dataSource: DataSource, courtCaseId: number, user: User): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const setFields: QueryDeepPartialEntity<CourtCase> = {}
  const { canLockExceptions, canLockTriggers } = user

  const query = courtCaseRepository.createQueryBuilder().update(CourtCase)

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
