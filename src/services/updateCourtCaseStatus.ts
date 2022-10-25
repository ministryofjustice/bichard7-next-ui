import { Brackets, DataSource, EntityManager, UpdateResult } from "typeorm/"
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
  const updateResolutionStatus = isErrorUpdate(recordType)
    ? {
        errorStatus: resolutionStatus
      }
    : {
        triggerStatus: resolutionStatus
      }

  const field = isErrorUpdate(recordType) ? "error" : "trigger"

  try {
    const query = courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set(updateResolutionStatus)
      .where("error_id = :id", { id: courtCaseId })
      .andWhere(`${field}_status is NOT NULL`)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`${field}_locked_by_id = :user`, { user: username }).orWhere(`${field}_locked_by_id is NULL`)
        })
      )

    return await query.returning("*").execute()
  } catch (error) {
    return error as Error
  }
}

export default updateCourtCaseStatus
