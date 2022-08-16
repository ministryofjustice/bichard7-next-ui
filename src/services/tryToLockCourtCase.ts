import { DataSource, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"

const tryToLockCourtCase = async (
  dataSource: DataSource,
  courtCaseId: number,
  userName: string
): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  try {
    return await courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set({
        errorLockedByUsername: userName,
        triggerLockedByUsername: userName
      })
      .where("error_id = :id", { id: courtCaseId })
      .andWhere("error_locked_by_id IS NULL")
      .andWhere("trigger_locked_by_id IS NULL")
      .execute()
  } catch (err) {
    console.error(err)
    return err as Error
  }
}

export default tryToLockCourtCase
