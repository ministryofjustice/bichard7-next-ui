import { DataSource, UpdateResult } from "typeorm/"
import CourtCase from "./entities/CourtCase"

const updateCourtCaseUpdatedHO = async (
  dataSource: DataSource,
  courtCaseId: number,
  updatedHO: string
): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  try {
    return await courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set({
        updatedHearingOutcome: updatedHO
      })
      .where("error_id = :id", { id: courtCaseId })
      .execute()
  } catch (error) {
    return error as Error
  }
}

export default updateCourtCaseUpdatedHO
