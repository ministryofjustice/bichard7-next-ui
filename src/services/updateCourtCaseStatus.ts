import { DataSource, EntityManager, UpdateResult } from "typeorm/"
import { ResolutionStatus } from "types/ResolutionStatus"
import { RecordType } from "types/RecordType"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"

const isErrorUpdate = (recordType: RecordType) => recordType === "Error"

const updateCourtCaseStatus = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  recordType: RecordType,
  resolutionStatus: ResolutionStatus,
  { username }: User
): Promise<UpdateResult | Error> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  const updatedField = isErrorUpdate(recordType)
    ? {
        errorStatus: resolutionStatus
      }
    : {
        triggerStatus: resolutionStatus
      }

  const fieldLockedBy = isErrorUpdate(recordType) ? "error_locked_by_id" : "trigger_locked_by_id"

  try {
    return await courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set(updatedField)
      .where("error_id = :id", { id: courtCaseId })
      .andWhere(`${fieldLockedBy} is NULL OR ${fieldLockedBy} = :user`, { user: username })
      .returning("*")
      .execute()
  } catch (error) {
    return error as Error
  }
}

export default updateCourtCaseStatus
