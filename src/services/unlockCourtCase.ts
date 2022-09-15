import { DataSource, UpdateResult } from "typeorm/"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"

const unlockCourtCase = async (
  dataSource: DataSource,
  courtCaseId: number,
  user: User
): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const setFields: QueryDeepPartialEntity<CourtCase> = {}

  try {
    const query = courtCaseRepository.createQueryBuilder().update(CourtCase)

    if (user.canLockExceptions) {
      setFields.errorLockedByUsername = null
    }
    if (user.canLockTriggers) {
      setFields.triggerLockedByUsername = null
    }

    query.set(setFields).where("error_id = :id", { id: courtCaseId })

    return await query.execute()
  } catch (error) {
    return error as Error
  }
}

export default unlockCourtCase
