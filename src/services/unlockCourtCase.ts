import { DataSource, UpdateResult } from "typeorm/"
import CourtCase from "./entities/CourtCase"

const unlockCourtCase = async (dataSource: DataSource, courtCaseId: number): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  try {
    return await courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set({
        errorLockedByUsername: null,
        triggerLockedByUsername: null
      })
      .where("error_id = :id", { id: courtCaseId })
      .execute()
  } catch (error) {
    return error as Error
  }
}

export default unlockCourtCase
