import { DataSource, UpdateResult } from "typeorm/"
import CourtCase from "./entities/CourtCase"

const updateCourtCaseAho = async (
  dataSource: DataSource,
  courtCaseId: number,
  updatedHo: string
): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  try {
    return await courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set({
        hearingOutcome: updatedHo,
        userUpdatedFlag: 1
      })
      .where("error_id = :id", { id: courtCaseId })
      .returning("*")
      .execute()
  } catch (error) {
    return error as Error
  }
}

export default updateCourtCaseAho
