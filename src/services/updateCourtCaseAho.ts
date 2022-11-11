import { DataSource, EntityManager, UpdateResult } from "typeorm/"
import CourtCase from "./entities/CourtCase"

const updateCourtCaseAho = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  updatedHo: string,
  userUpdated: boolean
): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  try {
    return await courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set({
        updatedHearingOutcome: updatedHo,
        userUpdatedFlag: userUpdated ? 1 : 0
      })
      .where("error_id = :id", { id: courtCaseId })
      .returning("*")
      .execute()
  } catch (error) {
    return error as Error
  }
}

export default updateCourtCaseAho
