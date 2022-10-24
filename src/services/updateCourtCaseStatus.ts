import { DataSource, EntityManager, UpdateResult } from "typeorm/"
import { ResolutionStatus } from "types/ResolutionStatus"
import { RecordType } from "types/RecordType"
import CourtCase from "./entities/CourtCase"

const updateCourtCaseStatus = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  recordType: RecordType,
  resolutionStatus: ResolutionStatus
): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  const updatedField =
    recordType === "Error"
      ? {
          errorStatus: resolutionStatus
        }
      : {
          triggerStatus: resolutionStatus
        }

  try {
    return await courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set(updatedField)
      .where("error_id = :id", { id: courtCaseId })
      .returning("*")
      .execute()
  } catch (error) {
    return error as Error
  }
}

export default updateCourtCaseStatus
