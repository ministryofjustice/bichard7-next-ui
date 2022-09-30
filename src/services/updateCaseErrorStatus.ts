import { DataSource, UpdateResult } from "typeorm/"
import { ResolutionStatus } from "types/ResolutionStatus"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"

const updateCaseErrorStatus = async (
  dataSource: DataSource,
  courtCaseId: number,
  errorStatus: ResolutionStatus,
  { username }: User
): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  try {
    return await courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set({
        errorStatus,
        ...(username && { errorResolvedBy: username }) // It seems odd were not setting by error_resolved_ts (see ErrorDAO.java -> line 2507)
      })
      .where("error_id = :id", { id: courtCaseId })
      .returning("*")
      .execute()
  } catch (error) {
    return error as Error
  }
}

export default updateCaseErrorStatus
