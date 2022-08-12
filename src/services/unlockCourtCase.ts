import { DataSource } from "typeorm/"
import CourtCase from "./entities/CourtCase"

const unlockCourtCase = async (dataSource: DataSource, courtCaseId: number): Promise<boolean | Error> => {
  const courtCaseRepository = await dataSource.getRepository(CourtCase)

  try {
    await courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set({
        errorLockedById: null,
        triggerLockedById: null
      })
      .where("error_id = :id", { id: courtCaseId })
      .execute()
  } catch (error) {
    return error as Error
  }

  return true
}

export default unlockCourtCase
