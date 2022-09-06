import { DataSource, UpdateResult } from "typeorm/"
import CourtCase from "./entities/CourtCase"

const updateCourtCaseUpdatedHo = async (
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
        updatedHearingOutcome: updatedHo,
        userUpdatedFlag: 1
      })
      .where("error_id = :id", { id: courtCaseId })
      .returning("*")
      .execute()
  } catch (error) {
    return error as Error
  }
}

export default updateCourtCaseUpdatedHo
